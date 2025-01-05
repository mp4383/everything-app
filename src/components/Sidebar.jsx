import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Article as ArticleIcon,
  ShowChart as ShowChartIcon,
  AccountBalanceWallet as WalletIcon,
  Event as CalendarIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/feed', label: 'Social Feed', icon: ChatIcon },
  { path: '/news', label: 'News', icon: ArticleIcon },
  { path: '/market', label: 'Market', icon: ShowChartIcon },
  { path: '/wallet', label: 'Wallet', icon: WalletIcon },
  { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
];

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            width: DRAWER_WIDTH,
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider'
          },
        }}
      >
        <Box sx={{ mt: 7 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton 
                  onClick={() => handleItemClick(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>
                    <item.icon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
