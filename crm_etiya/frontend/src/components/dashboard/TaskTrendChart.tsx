import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Box, Paper, Typography } from '@mui/material';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TaskTrendChartProps {
  data: {
    labels: string[];
    completed: number[];
    created: number[];
  };
}

const TaskTrendChart = ({ data }: TaskTrendChartProps) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Tamamlanan Görevler',
        data: data.completed,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
      },
      {
        label: 'Yeni Görevler',
        data: data.created,
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Görev Trendi (Son 7 Gün)
      </Typography>
      <Box sx={{ height: 300 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default TaskTrendChart;