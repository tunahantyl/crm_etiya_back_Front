const formatDate = (value: unknown) => {
  if (!value) return '-';
  if (typeof value === 'object' && value !== null) {
    const v: any = value;
    if (typeof v.year === 'number' && typeof v.month === 'number' && typeof v.day === 'number') {
      const date = new Date(
        v.year,
        (v.month - 1) || 0,
        v.day || 1,
        v.hour || 0,
        v.minute || 0,
        v.second || 0,
        v.nano ? Math.floor(v.nano / 1_000_000) : 0
      );
      if (!Number.isNaN(date.getTime())) return date.toLocaleDateString('tr-TR');
    }
  }
  const raw = typeof value === 'string' ? value : String(value);
  const isoLike = raw.includes('T') || raw.includes('+') || raw.endsWith('Z');
  if (isoLike) {
    const d = new Date(raw.includes('T') ? raw : raw.replace(' ', 'T'));
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('tr-TR');
  }
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?$/);
  if (m) {
    const [_, y, mo, d, h, mi, s, ms] = m;
    const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s), ms ? Number(ms.slice(0,3).padEnd(3, '0')) : 0);
    if (!Number.isNaN(date.getTime())) return date.toLocaleDateString('tr-TR');
  }
  return raw.split(' ')[0] || raw.split('T')[0] || raw;
};
import { useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { pageContainerStyles, pageHeaderStyles, tableContainerStyles } from '../../styles/commonStyles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchCustomers, deleteCustomer } from '../../features/customers/customerSlice';

const CustomerList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((s) => s.customers);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleEdit = (id: number) => {
    navigate(`/customers/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Bu müşteriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.');
    if (!confirmed) return;
    try {
      await dispatch(deleteCustomer(id)).unwrap();
    } catch (err: any) {
      window.alert(err || 'Müşteri silinemedi');
    }
  };

  const handleAddNew = () => {
    navigate('/customers/new');
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Müşteri Adı',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'email',
      headerName: 'E-posta',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'phone',
      headerName: 'Telefon',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'createdAt',
      headerName: 'Kayıt Tarihi',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <span>{formatDate((params as any).value)}</span>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Durum',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Aktif' : 'Pasif'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row.id)}
            sx={{ minWidth: 'auto' }}
          >
            Düzenle
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.id)}
            sx={{ minWidth: 'auto' }}
          >
            Sil
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={pageHeaderStyles}>
        <Typography variant="h5" fontWeight="medium">
          Müşteriler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ px: 3 }}
        >
          Yeni Müşteri
        </Button>
      </Box>

      <Paper sx={pageContainerStyles}>
        <Box sx={tableContainerStyles}>
          <DataGrid
            rows={customers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'createdAt', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                borderBottom: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8f8f8',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerList;