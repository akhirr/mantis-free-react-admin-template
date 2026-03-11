// assets
import {
  EditOutlined,
  ProfileOutlined,
  DollarOutlined,
  HistoryOutlined
} from '@ant-design/icons';

// icons mapping
const icons = {
  EditOutlined,
  ProfileOutlined,
  DollarOutlined,
  HistoryOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'aktivitas',
      title: 'Aktivitas Harian',
      type: 'item',
      url: '/aktivitas',
      icon: icons.EditOutlined
    },
    {
      id: 'rekap_aktivitas',
      title: 'Rekap Aktivitas Harian',
      type: 'item',
      url: '/rekap_aktivitas',
      icon: icons.ProfileOutlined
    },
    {
      id: 'rekap_absensi',
      title: 'Rekap Absensi',
      type: 'item',
      url: '/rekap_absensi',
      icon: icons.HistoryOutlined
    },
    {
      id: 'tpp',
      title: 'Perhitungan TPP',
      type: 'item',
      url: '/tpp',
      icon: icons.DollarOutlined
    }
  ]
};

export default utilities;