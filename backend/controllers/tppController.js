import { poolPublic, poolLocal } from "../config/db.js";


export const estimasiTPP = async (req, res) => {
  try {
    const bulan = parseInt(req.query.bulan, 10);
    const tahun = parseInt(req.query.tahun, 10);
    const nip = req.user?.nip;
    const id = req.user?.id;

    if (!bulan || !tahun) return res.status(400).json({ message: "Bulan & Tahun wajib diisi" });
    if (!nip) return res.status(401).json({ message: "Token tidak valid" });

    const startDate = `${tahun}-${String(bulan).padStart(2, "0")}-01`;

    // ===== 1) Kalender + Absen (DB PUBLIC) =====
    const sqlKalender = `
      WITH kalender AS (
        SELECT generate_series(
          date_trunc('month', $2::date),
          (date_trunc('month', $2::date) + interval '1 month - 1 day')::date,
          interval '1 day'
        )::date AS tanggal
      )
      SELECT
        k.tanggal,
        EXTRACT(ISODOW FROM k.tanggal) AS isodow,
        (libur.tanggal IS NOT NULL) AS is_libur,
        a.jam_absen_masuk,
        a.terlambat_menit,
        r.status
      FROM kalender k
      LEFT JOIN absen a
        ON a.nip = $1
        AND DATE(a.tanggal AT TIME ZONE 'Asia/Jakarta') = k.tanggal
      LEFT JOIN ref_status_absen r
        ON r.id = a.status
      LEFT JOIN jadwal_tanggal_merah libur
        ON libur.tanggal::date = k.tanggal
      ORDER BY k.tanggal;
    `;

    const { rows: kalenderRows } = await poolPublic.query(sqlKalender, [nip, startDate]);

    // Hari kerja = Sen-Jum & bukan tanggal merah
    const hariKerjaRows = kalenderRows.filter(r => ![6,7].includes(Number(r.isodow)) && r.is_libur === false);
    const hariKerja = hariKerjaRows.length;

    // Hadir (sesuaikan definisi kalau perlu)
    const hadir = hariKerjaRows.filter(r => r.status === "Hadir" || r.jam_absen_masuk != null).length;

    const telatAtauTidakAbsen = hariKerjaRows.filter(r =>
      (Number(r.terlambat_menit || 0) > 0) || (r.jam_absen_masuk == null)
    ).length;

    
    // durasi = MENIT
    const TARGET_PER_HARI = 420; // 7 jam = 420 menit

    const sqlAkt = `
      SELECT tanggal::date AS tanggal, COALESCE(SUM(durasi),0) AS total_menit
      FROM aktivitas
      WHERE id = $1
        AND tanggal >= date_trunc('month', $2::date)::date
        AND tanggal <  (date_trunc('month', $2::date) + interval '1 month')::date
      GROUP BY tanggal::date
    `;
    const { rows: aktRows } = await poolLocal.query(sqlAkt, [id, startDate]);

    const menitMap = new Map(
      aktRows.map(x => [new Date(x.tanggal).toISOString().slice(0,10), Number(x.total_menit || 0)])
    );

    let totalSkorKinerja = 0; // skor 0..hariKerja
    let totalMenitHariKerja = 0;

    for (const d of hariKerjaRows) {
      const key = new Date(d.tanggal).toISOString().slice(0,10);
      const totalMenit = menitMap.get(key) || 0;

      totalMenitHariKerja += totalMenit;

      const skorHarian = Math.min(totalMenit / TARGET_PER_HARI, 1); // 0..1
      totalSkorKinerja += skorHarian;
    }

    const persenKehadiran = hariKerja ? (hadir / hariKerja) * 100 : 0;
    const persenKinerja = hariKerja ? (totalSkorKinerja / hariKerja) * 100 : 0;

    const kontribusiKehadiran = persenKehadiran * 0.4;
    const kontribusiKinerja = persenKinerja * 0.6;
    const totalPersen = kontribusiKehadiran + kontribusiKinerja;

    // TODO: ambil dari tabel pegawai/jabatan
    const tppDasar = 1000000;
    const estimasiNominal = Math.round(tppDasar * (totalPersen / 100));

    res.json({
      bulan, tahun,
      tppDasar,
      estimasiNominal,
      totalPersen: Math.round(totalPersen),

      kehadiran: {
        bobot: 40,
        persen: Math.round(persenKehadiran),
        kontribusi: Math.round(kontribusiKehadiran),
        hariKerja,
        hadir,
        telatAtauTidakAbsen,
      },

      kinerja: {
        bobot: 60,
        persen: Math.round(persenKinerja),
        kontribusi: Math.round(kontribusiKinerja),
        hariKerja,
        targetMenitPerHari: TARGET_PER_HARI,
        totalMenitHariKerja,
      },
    });
  } catch (err) {
    console.error("estimasiTPP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};