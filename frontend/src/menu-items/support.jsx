// assets
import { QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {

  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://drive.google.com/drive/folders/1xP6bzt6_jKgdruocvzzaUWrrdkcjd1az/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;
