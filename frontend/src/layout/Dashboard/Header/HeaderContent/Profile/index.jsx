import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// project imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// icons
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';

export default function Profile() {
  const theme = useTheme();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
    window.location.reload();
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 'auto' }}>
      <Tooltip title="Profile">
        <ButtonBase ref={anchorRef} onClick={handleToggle}>
          <Avatar alt="profile user" src={avatar1} size="sm" />
        </ButtonBase>
      </Tooltip>

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.vars.customShadows.z1, width: 260 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>

                  {/* ===== USER INFO ===== */}
                  <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar src={avatar1} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="h6">
                          {user?.nama || 'User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user?.nip || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* ===== MENU ===== */}
                  <List sx={{ p: 0 }}>
                    <ListItemButton onClick={() => navigate('/account-settings')}>
                      <ListItemIcon>
                        <SettingOutlined />
                      </ListItemIcon>
                      <ListItemText primary="Account Settings" />
                    </ListItemButton>

                    <ListItemButton onClick={() => navigate('/profile')}>
                      <ListItemIcon>
                        <UserOutlined />
                      </ListItemIcon>
                      <ListItemText primary="View Profile" />
                    </ListItemButton>

                    <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutOutlined />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>

                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}