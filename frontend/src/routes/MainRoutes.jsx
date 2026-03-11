import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PrivateRoute from 'components/PrivateRoute';

// verifikasi pages
import VerifikasiAktivitas from 'pages/verifikasi/VerifikasiAktivitas';
import RiwayatVerifikasi from 'pages/verifikasi/RiwayatAktivitas';

// pages
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const Aktivitas = Loadable(lazy(() => import('pages/aktivitas/aktivitas')));
const RekapAktivitas = Loadable(lazy(() => import('pages/rekap_aktivitas/rekap_aktivitas')));
const RekapAbsensi = Loadable(lazy(() => import('pages/rekap-absensi/index')));
const TPP = Loadable(lazy(() => import('pages/perhitunganTPP/perhitunganTPP')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    // Dashboard
    {
      path: 'dashboard/default',
      element: <DashboardDefault />
    },

    // Aktivitas
    {
      path: 'aktivitas',
      element: <Aktivitas />
    },
     {
      path: 'rekap_aktivitas',
      element: <RekapAktivitas />
    },

    // Rekap Absensi
    {
      path: 'rekap_absensi',
      element: <RekapAbsensi />
    },

    // TPP
    {
      path: 'tpp',
      element: <TPP />
    },

    // ================= VERIFIKASI =================
    {
      path: 'verifikasi',
      children: [
        {
          path: 'aktivitas',
          element: <VerifikasiAktivitas />
        },
        {
          path: 'riwayat',
          element: <RiwayatVerifikasi />
        }
      ]
    }
    // =============================================
  ]
};

export default MainRoutes;