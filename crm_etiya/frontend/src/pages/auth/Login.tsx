import { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearError } from '../../features/auth/authSlice';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi giriniz')
    .required('E-posta adresi zorunludur'),
  password: yup
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre zorunludur'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Sayfa yüklendiğinde hata mesajını temizle
    dispatch(clearError());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(login(values));
      if (login.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        flex: '1 1 auto',
      }}
    >
      {/* Arka plan resmi - tam sayfa */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(1200px 600px at -10% 10%, rgba(99,102,241,0.25) 0%, transparent 60%),\
             radial-gradient(1000px 500px at 110% 0%, rgba(168,85,247,0.25) 0%, transparent 60%),\
             radial-gradient(900px 500px at 50% 100%, rgba(59,130,246,0.22) 0%, transparent 60%),\
             linear-gradient(135deg, #0b1120 0%, #0a0f1e 100%)',
          zIndex: 1,
        }}
      />
      {/* İnce grid deseni */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),\
             linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '48px 48px, 48px 48px',
          opacity: 0.6,
          maskImage:
            'radial-gradient(1200px 800px at 30% 30%, rgba(0,0,0,1), transparent 70%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.18)',
          zIndex: 2,
        }}
      />

      {/* Login formu */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          p: 2,
          pl: { xs: 2, md: 8, lg: 12 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            width: '100%',
            maxWidth: 450,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
            },
          }}
        >
          {/* Logo ve başlık */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box 
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                  },
                  '50%': {
                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
                  },
                  '100%': {
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                  },
                },
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>
                ✨
              </Typography>
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              align="center" 
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                mb: 1,
              }}
            >
              CRM Portal
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ fontWeight: 500, opacity: 0.8 }}
            >
              Hesabınızla giriş yapın
            </Typography>
          </Box>

          {/* Hata mesajı */}
          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="E-posta"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={loading}
              sx={{ 
                mb: 2,
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 2,
                }
              }}
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Şifre"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              disabled={loading}
              sx={{ 
                mb: 3,
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 2,
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                },
                '&:disabled': {
                  background: 'rgba(102, 126, 234, 0.5)',
                  transform: 'none',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Giriş Yap'}
            </Button>
          </Box>

          {/* Alt kısım */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Hesabınız yok mu?{' '}
              <Button
                onClick={() => navigate('/register')}
                sx={{ 
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                }}
              >
                Kayıt Ol
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;