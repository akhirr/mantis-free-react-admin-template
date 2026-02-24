// assets
import {
  EditOutlined,
  ProfileOutlined,
  DollarOutlined,

} from '@ant-design/icons';

// icons
const icons = {
  EditOutlined,
  ProfileOutlined,
  DollarOutlined,
  
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
      icon: icons.EditOutlined,
    },
    {
      id: 'rekap_absensi',
      title: 'Rekap Absensi',
      type: 'item',
      url: '/rekap_absensi',
      icon: icons.ProfileOutlined,
    },
    {
      id: 'tpp',
      title: 'Perhitungan TPP',
      type: 'item',
      url: '/tpp',
      icon: icons.DollarOutlined,
    }
    
  ]
};

export default utilities;
