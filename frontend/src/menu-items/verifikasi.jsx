import {
  CheckCircleOutlined,
  HistoryOutlined,
  TeamOutlined
} from '@ant-design/icons';

const icons = {
  CheckCircleOutlined,
  HistoryOutlined,
  TeamOutlined
};

const verifikasi = {
  id: 'verifikasi',
  title: 'Verifikasi',
  type: 'group',
  children: [
    {
      id: 'verifikasi-aktivitas',
      title: 'Verifikasi Aktivitas Bawahan',
      type: 'item',
      url: '/verifikasi/aktivitas',
      icon: icons.TeamOutlined
    },
    {
      id: 'riwayat-verifikasi',
      title: 'Riwayat Verifikasi',
      type: 'item',
      url: '/verifikasi/riwayat',
      icon: icons.HistoryOutlined
    }
  ]
};

export default verifikasi;