import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { pageContainerStyles, pageHeaderStyles, formStyles } from '../../styles/commonStyles';
import { useAppDispatch } from '../../app/hooks';
import { createCustomer } from '../../features/customers/customerSlice';

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .required('İsim zorunludur'),
  email: yup
    .string()
    .email('Geçerli bir e-posta adresi giriniz')
    .required('E-posta adresi zorunludur'),
  phone: yup
    .string()
    .matches(/^[0-9-+()]*$/, 'Geçersiz telefon numarası formatı')
    .min(10, 'Telefon numarası en az 10 karakter olmalıdır'),
});

const CustomerForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      isActive: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      try {
        await dispatch(createCustomer({
          name: values.name,
          email: values.email,
          phone: values.phone,
        })).unwrap();
        navigate('/customers');
      } catch (err) {
        setError('Müşteri kaydedilemedi. Lütfen tekrar deneyiniz.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      setTimeout(() => {
        formik.setValues({
          name: 'Ahmet Yılmaz',
          email: 'ahmet@ornek.com',
          phone: '555-0123',
          isActive: true,
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditMode]);

  if (isLoading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={pageHeaderStyles}>
        <Typography variant="h5" fontWeight="medium">
          {isEditMode ? 'Müşteri Düzenle' : 'Yeni Müşteri'}
        </Typography>
      </Box>

      <Paper sx={{ ...pageContainerStyles, maxWidth: 800, mx: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={formStyles}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Ad Soyad"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              disabled={isLoading}
              required
            />

            <TextField
              fullWidth
              label="E-posta"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={isLoading}
              required
            />

            <TextField
              fullWidth
              label="Telefon"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              disabled={isLoading}
              placeholder="555-0123"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isActive}
                  onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                  name="isActive"
                  disabled={isLoading}
                  color="primary"
                />
              }
              label="Aktif"
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/customers')}
                disabled={isLoading}
                size="large"
                sx={{ minWidth: 120 }}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                size="large"
                sx={{ minWidth: 120 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Kaydet'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerForm;