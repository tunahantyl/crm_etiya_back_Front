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
      valueFormatter: (params) => {
        const value = (params as any).value as string | number | Date | undefined;
        if (!value) return '-';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('tr-TR');
      },
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