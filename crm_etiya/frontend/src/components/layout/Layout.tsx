import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      width: '100vw',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          p: 3,
          pt: 10, // Navbar yüksekliği + padding
          ml: '240px', // Sidebar genişliği
          width: 'calc(100vw - 240px)', // Tam genişlik - sidebar
          backgroundColor: 'transparent',
          overflow: 'auto' // İçerik scroll'u
        }}
      >
        {/* Navbar */}
        <Navbar />
        
        {/* Page content */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;