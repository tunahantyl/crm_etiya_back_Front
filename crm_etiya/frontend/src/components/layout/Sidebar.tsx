import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  const menuItems = [
    {
      text: 'Gösterge Paneli',
      icon: <DashboardIcon />,
      path: '/dashboard',
      showAlways: true,
    },
    {
      text: 'Müşteriler',
      icon: <PeopleIcon />,
      path: '/customers',
      adminOnly: true,
    },
    {
      text: 'Görevler',
      icon: <AssignmentIcon />,
      path: '/tasks',
      showAlways: true,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box 
        sx={{ 
          p: 3, 
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            color: 'white',
            fontWeight: 700,
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          CRM System
        </Typography>
      </Box>
      
      <List sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
        {menuItems.map((item) => {
          if (!item.showAlways && item.adminOnly && !isAdmin) {
            return null;
          }

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.25)',
                  },
                },
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateX(4px)',
                },
                my: 0.5,
                mx: 2,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'white', 
                  minWidth: 40,
                  '& svg': {
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    transition: 'all 0.3s ease',
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;