import { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { tr as trLocale } from 'date-fns/locale';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchTaskById, createTask, updateTask, clearSelectedTask } from '../../features/tasks/taskSlice';
import { fetchCustomers } from '../../features/customers/customerSlice';
import { pageContainerStyles, pageHeaderStyles } from '../../styles/commonStyles';

const validationSchema = yup.object({
  title: yup
    .string()
    .min(3, 'Başlık en az 3 karakter olmalıdır')
    .max(100, 'Başlık en fazla 100 karakter olabilir')
    .required('Başlık zorunludur'),
  description: yup
    .string()
    .min(10, 'Açıklama en az 10 karakter olmalıdır')
    .max(500, 'Açıklama en fazla 500 karakter olabilir')
    .required('Açıklama zorunludur'),
  customerId: yup
    .number()
    .required('Müşteri seçimi zorunludur'),
  assignedUserId: yup
    .number()
    .required('Atanacak kişi seçimi zorunludur'),
  dueDate: yup
    .date()
    .min(new Date(), 'Bitiş tarihi geçmiş bir tarih olamaz')
    .required('Bitiş tarihi zorunludur'),
  status: yup
    .string()
    .oneOf(['PENDING', 'IN_PROGRESS', 'COMPLETED'], 'Geçersiz durum')
    .required('Durum seçimi zorunludur'),
});

const mockUsers = [
  { id: 1, name: 'Admin Kullanıcı' },
  { id: 2, name: 'Destek Kullanıcısı' },
  { id: 3, name: 'Satış Temsilcisi' },
];

const TaskForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const { selectedTask, loading, error } = useAppSelector((state) => state.tasks);
  const { customers } = useAppSelector((state) => state.customers);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchTaskById(Number(id)));
    }
    // Müşterileri listelemek için backend'den çek
    dispatch(fetchCustomers());
    return () => {
      dispatch(clearSelectedTask());
    };
  }, [dispatch, id, isEditMode]);

  const formik = useFormik({
    initialValues: {
      title: selectedTask?.title || '',
      description: selectedTask?.description || '',
      customerId: selectedTask?.customerId || '',
      assignedUserId: selectedTask?.assignedUserId || '',
      dueDate: selectedTask?.dueDate ? new Date(selectedTask.dueDate) : null,
      status: selectedTask?.status || 'PENDING',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          assignedUserId: Number(values.assignedUserId),
          customerId: Number(values.customerId),
          dueDate: values.dueDate ? (values.dueDate as Date).toISOString() : new Date().toISOString(),
        } as any;
        if (isEditMode && id) {
          await dispatch(updateTask({ id: Number(id), data: payload })).unwrap();
        } else {
          await dispatch(createTask(payload)).unwrap();
        }
        navigate('/tasks');
      } catch (err) {
        // Error handling redux tarafında yapılıyor
      }
    },
  });

  // Sadece admin ve görev sahibi düzenleyebilir
  const canEdit = user?.role === 'ADMIN' || selectedTask?.assignedUserId === Number(user?.id);

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isEditMode && !canEdit) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">
          Bu görevi düzenleme yetkiniz bulunmamaktadır.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={pageHeaderStyles}>
        <Typography variant="h5" fontWeight="medium">
          {isEditMode ? 'Görev Düzenle' : 'Yeni Görev'}
        </Typography>
      </Box>

      <Paper sx={{ ...pageContainerStyles, maxWidth: 800, mx: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Başlık"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Açıklama"
              name="description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              disabled={loading}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl 
                fullWidth 
                error={formik.touched.customerId && Boolean(formik.errors.customerId)}
              >
                <InputLabel>Müşteri</InputLabel>
                <Select
                  name="customerId"
                  value={formik.values.customerId}
                  label="Müşteri"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl 
                fullWidth 
                error={formik.touched.assignedUserId && Boolean(formik.errors.assignedUserId)}
              >
                <InputLabel>Atanacak Kişi</InputLabel>
                <Select
                  name="assignedUserId"
                  value={formik.values.assignedUserId}
                  label="Atanacak Kişi"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                >
                  {mockUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl 
                fullWidth 
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <InputLabel>Durum</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  label="Durum"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                >
                  <MenuItem value="PENDING">Beklemede</MenuItem>
                  <MenuItem value="IN_PROGRESS">Devam Ediyor</MenuItem>
                  <MenuItem value="COMPLETED">Tamamlandı</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                <DatePicker
                  label="Bitiş Tarihi"
                  value={formik.values.dueDate}
                  onChange={(value) => formik.setFieldValue('dueDate', value)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.dueDate && Boolean(formik.errors.dueDate),
                      helperText: formik.touched.dueDate && formik.errors.dueDate as string,
                    }
                  }}
                  disabled={loading}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/tasks')}
                disabled={loading}
                size="large"
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : isEditMode ? 'Güncelle' : 'Oluştur'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskForm;