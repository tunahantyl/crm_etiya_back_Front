import { Card, CardContent, Typography, Box, Grow } from '@mui/material';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
}

const StatCard = ({ title, value, icon, color = '#667eea' }: StatCardProps) => {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Grow in={mounted} timeout={600}>
      <Card 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{ 
          height: '100%', 
          p: 1, 
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: hovered 
            ? '0 20px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)'
            : '0 10px 30px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
          }
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            <Box sx={{
              width: 48,
              height: 48,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${color}15, ${color}25)`,
              color: color,
              position: 'relative',
              transition: 'all 0.3s ease',
              transform: hovered ? 'rotate(10deg) scale(1.1)' : 'rotate(0deg) scale(1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${color}20, transparent)`,
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
              },
              '& svg': {
                fontSize: '1.5rem',
                filter: hovered ? `drop-shadow(0 4px 8px ${color}40)` : 'none',
                transition: 'filter 0.3s ease',
              }
            }}>
              {icon}
            </Box>
          </Box>
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default StatCard;