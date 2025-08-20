import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppSelector } from '../../app/hooks';
import { authService } from '../../services/api/authService';
import { pageContainerStyles, pageHeaderStyles } from '../../styles/commonStyles';

const passwordValidationSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Mevcut şifre zorunludur'),
  newPassword: yup
    .string()
    .min(6, 'Yeni şifre en az 6 karakter olmalıdır')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
    )
    .required('Yeni şifre zorunludur'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur'),
});

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        await authService.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });

        setSuccess('Şifreniz başarıyla değiştirildi');
        formik.resetForm();
      } catch (err: any) {
        setError(err.message || 'Şifre değiştirme işlemi başarısız');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box>
      <Box sx={pageHeaderStyles}>
        <Typography variant="h5" fontWeight="medium">
          Profil Ayarları
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profil Bilgileri */}
        <Grid item xs={12} md={6}>
          <Paper sx={pageContainerStyles}>
            <Typography variant="h6" gutterBottom>
              Profil Bilgileri
            </Typography>
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Ad Soyad"
                value={user?.name}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="E-posta"
                value={user?.email}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Rol"
                value={user?.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}
                disabled
              />
            </Box>
          </Paper>
        </Grid>

        {/* Şifre Değiştirme */}
        <Grid item xs={12} md={6}>
          <Paper sx={pageContainerStyles}>
            <Typography variant="h6" gutterBottom>
              Şifre Değiştir
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                name="currentPassword"
                label="Mevcut Şifre"
                type="password"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                disabled={loading}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                name="newPassword"
                label="Yeni Şifre"
                type="password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                helperText={formik.touched.newPassword && formik.errors.newPassword}
                disabled={loading}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                name="confirmPassword"
                label="Yeni Şifre Tekrar"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                disabled={loading}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Şifre Değiştir'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;