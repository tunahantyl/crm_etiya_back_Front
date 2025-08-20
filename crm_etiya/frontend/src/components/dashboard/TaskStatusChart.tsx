import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Box, Paper, Typography } from '@mui/material';

// Chart.js bileşenlerini kaydet
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface TaskStatusChartProps {
  data: {
    pending: number;
    inProgress: number;
    completed: number;
  };
}

const TaskStatusChart = ({ data }: TaskStatusChartProps) => {
  const chartData = {
    labels: ['Beklemede', 'Devam Ediyor', 'Tamamlandı'],
    datasets: [
      {
        data: [data.pending, data.inProgress, data.completed],
        backgroundColor: [
          '#f44336', // Kırmızı - Beklemede
          '#ff9800', // Turuncu - Devam Ediyor
          '#4caf50', // Yeşil - Tamamlandı
        ],
        borderColor: [
          '#d32f2f',
          '#f57c00',
          '#388e3c',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Görev Durumları
      </Typography>
      <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
        <Pie data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default TaskStatusChart;