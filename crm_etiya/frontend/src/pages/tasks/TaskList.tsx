import { useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchTasks, fetchTasksByUser, updateTaskStatus, deleteTask } from '../../features/tasks/taskSlice';
import { pageContainerStyles, pageHeaderStyles, tableContainerStyles } from '../../styles/commonStyles';

const formatDate = (value: unknown) => {
  if (!value) return '-';
  const raw = typeof value === 'string' ? value : String(value);
  // Normalize common backend formats
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    // Fallback: show YYYY-MM-DD part if parse fails
    const onlyDate = raw.split('T')[0] || raw;
    return onlyDate;
  }
  return date.toLocaleDateString('tr-TR');
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'IN_PROGRESS':
      return 'info';
    case 'COMPLETED':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Beklemede';
    case 'IN_PROGRESS':
      return 'Devam Ediyor';
    case 'COMPLETED':
      return 'Tamamlandı';
    default:
      return status;
  }
};

const TaskList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    // Admin tüm görevleri görür, normal kullanıcı sadece kendi görevlerini
    if (user?.role === 'ADMIN') {
      dispatch(fetchTasks());
    } else if (user?.id) {
      dispatch(fetchTasksByUser(user.id));
    }
  }, [dispatch, user]);

  const handleEdit = (id: number) => {
    navigate(`/tasks/${id}`);
  };

  const handleAddNew = () => {
    navigate('/tasks/new');
  };

  const handleStatusChange = async (taskId: number, newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') => {
    await dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteTask(id));
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Görev',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'customerName',
      headerName: 'Müşteri',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'assignedTo',
      headerName: 'Atanan',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'status',
      headerName: 'Durum',
      flex: 1,
      minWidth: 150,
       renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={getStatusLabel((params as any).value as string)}
            color={getStatusColor((params as any).value as string) as any}
            onClick={() => {
              const currentStatus = (params as any).value as string;
              let newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
              
              switch (currentStatus) {
                case 'PENDING':
                  newStatus = 'IN_PROGRESS';
                  break;
                case 'IN_PROGRESS':
                  newStatus = 'COMPLETED';
                  break;
                default:
                  newStatus = 'PENDING';
              }
              
              handleStatusChange(params.row.id, newStatus);
            }}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      ),
    },
    {
      field: 'dueDate',
      headerName: 'Bitiş Tarihi',
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row.id)}>
            Düzenle
          </Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.id)}>
            Sil
          </Button>
        </Box>
      ),
    },
  ];

  if (loading && !tasks.length) {
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
          Görevler
        </Typography>
        {user?.role === 'ADMIN' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ px: 3 }}
          >
            Yeni Görev
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={pageContainerStyles}>
        <Box sx={tableContainerStyles}>
          <DataGrid
            rows={tasks}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'dueDate', sort: 'asc' }],
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={undefined}
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

export default TaskList;