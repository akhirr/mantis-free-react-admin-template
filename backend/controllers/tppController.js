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

const sqlDisiplin = `
SELECT
  COALESCE(SUM(alfa),0) AS alpha,

  COALESCE(SUM(tmk1),0) AS tl1,
  COALESCE(SUM(tmk2),0) AS tl2,
  COALESCE(SUM(tmk3),0) AS tl3,
  COALESCE(SUM(tmk4),0) AS tl4,

  COALESCE(SUM(psw1),0) AS psw1,
  COALESCE(SUM(psw2),0) AS psw2,
  COALESCE(SUM(psw3),0) AS psw3,
  COALESCE(SUM(psw4),0) AS psw4

FROM absen_rekap
WHERE nip = $1
AND bulan = $2
AND tahun = $3
`;

const { rows: disiplinRows } = await poolPublic.query(sqlDisiplin, [nip, bulan, tahun]);


const disiplin = disiplinRows[0];
const potAlpha = (disiplin.alpha || 0) * 3;

const potTL1 = (disiplin.tl1 || 0) * 0.5;
const potTL2 = (disiplin.tl2 || 0) * 1;
const potTL3 = (disiplin.tl3 || 0) * 1.5;
const potTL4 = (disiplin.tl4 || 0) * 2;

const potPSW1 = (disiplin.psw1 || 0) * 0.5;
const potPSW2 = (disiplin.psw2 || 0) * 1;
const potPSW3 = (disiplin.psw3 || 0) * 1.5;
const potPSW4 = (disiplin.psw4 || 0) * 2;

const totalPotongan =
  potAlpha +
  potTL1 +
  potTL2 +
  potTL3 +
  potTL4 +
  potPSW1 +
  potPSW2 +
  potPSW3 +
  potPSW4;
    // Hari kerja = Sen-Jum & bukan tanggal merah
    const hariKerjaRows = kalenderRows.filter(r => ![6,7].includes(Number(r.isodow)) && r.is_libur === false);
    const hariKerja = hariKerjaRows.length;

    // Hadir (sesuaikan definisi kalau perlu)
    const STATUS_HADIR = ["Hadir", "Tugas Luar", "Izin", "Sakit"];

    const hadir = hariKerjaRows.filter(r =>
      STATUS_HADIR.includes(r.status) || r.jam_absen_masuk != null
    ).length;

    //const telatAtauTidakAbsen = hariKerjaRows.filter(r =>
    //  (Number(r.status || 0) > 0) || (r.jam_absen_masuk == null)
    //).length;

    const sqlKinerja = `
      SELECT
        tanggal,

        ROUND(
          LEAST(
            COALESCE(
              SUM(durasi) FILTER (WHERE LOWER(status)='final'),
              0
            ),
            8
          ) * 100.0 / 8,
          2
        ) AS persen

      FROM aktivitas

      WHERE user_id = $1
      AND EXTRACT(MONTH FROM tanggal) = $2
      AND EXTRACT(YEAR FROM tanggal) = $3

      GROUP BY tanggal
      `;
//kinerja
const { rows: kinerjaRows } = await poolLocal.query(sqlKinerja,[id,bulan,tahun]);
const totalCapaian =
kinerjaRows.reduce(
  (sum,row)=> sum + Number(row.persen || 0),
  0
);
const persenKinerja = hariKerja
  ? totalCapaian / hariKerja
  : 0;
const persenKinerjaFinal = Math.min(persenKinerja, 100);


//kehadiran
    const persenKehadiran = hariKerja ? (hadir / hariKerja) * 100 : 0;
    const persenKehadiranBersih = Math.max(
  persenKehadiran - totalPotongan,
  0
);
    
// kontribusi ke TPP
    const kontribusiKehadiran = persenKehadiranBersih * 0.4;
    const kontribusiKinerja = persenKinerjaFinal * 0.6;
    const totalPersen = kontribusiKehadiran + kontribusiKinerja;

    // ambil TPP dasar dari ta_tpp berdasarkan nip
    const qTpp = `
      SELECT COALESCE(besar_tpp, 0) AS besar_tpp
      FROM ta_tpp
      WHERE nip = $1
      ORDER BY id DESC
      LIMIT 1
    `;
    const { rows: tppRows } = await poolPublic.query(qTpp, [nip]);

    // besar_tpp di postgres numeric -> bisa string, jadi konversi aman:
    const tppDasar = Number(tppRows?.[0]?.besar_tpp ?? 0);
    // estimasi nominal = tppDasar * (totalPersen / 100)
    const estimasiNominal = Math.round(tppDasar * (totalPersen / 100));

    res.json({
      bulan, tahun,
      tppDasar,
      estimasiNominal,
      totalPersen: Math.round(totalPersen),

      kehadiran: {
        bobot: 40,
        persen: Number(persenKehadiran.toFixed(2)),
        persenBersih: Number(persenKehadiranBersih.toFixed(2)),
        potonganDisiplin: Number(totalPotongan.toFixed(2)),
        kontribusi: Number(kontribusiKehadiran.toFixed(2)),
        hariKerja,
        hadir

      //  telatAtauTidakAbsen,
      },

      kinerja: {
        bobot: 60,
        persen: Number(persenKinerjaFinal.toFixed(2)),
        kontribusi: Number(kontribusiKinerja.toFixed(2)),
        hariKerja,
        totalCapaian,
        targetCapaian: hariKerja * 100, // misal target 7 menit per hari kerja
        },
      disiplin: {
    alpha: Number(disiplin.alpha || 0),

    tl1: Number(disiplin.tl1 || 0),
    tl2: Number(disiplin.tl2 || 0),
    tl3: Number(disiplin.tl3 || 0),
    tl4: Number(disiplin.tl4 || 0),

    psw1: Number(disiplin.psw1 || 0),
    psw2: Number(disiplin.psw2 || 0),
    psw3: Number(disiplin.psw3 || 0),
    psw4: Number(disiplin.psw4 || 0)
  }
    });
  } catch (err) {
    console.error("estimasiTPP error:", err);
    res.status(500).json({ message: "Server error" });
  }


};