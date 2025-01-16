import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Stack,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  FitnessCenter as ExerciseIcon,
  Shower as ShowerIcon,
  Work as WorkIcon,
  Restaurant as FoodIcon,
  MusicNote as MusicIcon,
  Code as CodeIcon,
  TrendingUp as MarketIcon,
  ShowChart as TradingIcon
} from '@mui/icons-material';
import { useSchedule } from '../contexts/ScheduleContext';

const formatTimeRemaining = (ms) => {
  if (ms <= 0) return '0m';
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 
    ? `${hours}h ${minutes % 60}m`
    : `${minutes}m`;
};

const getActivityIcon = (activity) => {
  if (activity.toLowerCase().includes('exercise')) return ExerciseIcon;
  if (activity.toLowerCase().includes('shower')) return ShowerIcon;
  if (activity.toLowerCase().includes('job')) return WorkIcon;
  if (activity.toLowerCase().includes('food') || activity.toLowerCase().includes('lunch')) return FoodIcon;
  if (activity.toLowerCase().includes('music')) return MusicIcon;
  if (activity.toLowerCase().includes('coding')) return CodeIcon;
  if (activity.toLowerCase().includes('market')) return MarketIcon;
  if (activity.toLowerCase().includes('trading')) return TradingIcon;
  return ScheduleIcon;
};

const ScheduleWidget = () => {
  const { 
    schedule,
    currentActivity,
    nextActivity,
    timeRemaining,
    progress
  } = useSchedule();

  const now = new Date();
  const currentActivityRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (currentActivity && currentActivityRef.current) {
      currentActivityRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentActivity]);
  
  return (
    <Stack sx={{ height: '100%' }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          position: 'sticky', 
          top: 0,
          bgcolor: 'primary.main',
          zIndex: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        Schedule Tracker
      </Typography>
      
      <Stack spacing={2} sx={{ p: 2, flex: 1, overflow: 'hidden' }}>
        {currentActivity ? (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Chip
                    icon={<TimeIcon />}
                    label="Current Activity"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="subtitle2" color="text.secondary">
                    {currentActivity.startTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {currentActivity.endTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                  {currentActivity.activity}
                </Typography>
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress variant="determinate" value={progress} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Time remaining: {formatTimeRemaining(timeRemaining)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                No current activity
              </Typography>
            </CardContent>
          </Card>
        )}

        {nextActivity && (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Chip
                    icon={<ScheduleIcon />}
                    label="Up Next"
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                  <Typography variant="subtitle2" color="text.secondary">
                    {nextActivity.startTime.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Typography>
                </Stack>
                <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                  {nextActivity.activity}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}

        <Box ref={scrollContainerRef} sx={{ overflow: 'auto', flex: 1, bgcolor: '#fafafa', p: 1, mx: -2 }}>
          <Stack spacing={0}>
            {schedule.map(([start, end, activity], index) => {
              const startTime = new Date();
              const [startHour, startMinute] = start.split(':').map(Number);
              startTime.setHours(startHour, startMinute, 0, 0);
              
              const endTime = new Date();
              const [endHour, endMinute] = end.split(':').map(Number);
              endTime.setHours(endHour, endMinute, 0, 0);
              
              const isCompleted = now > endTime;
              const isCurrent = currentActivity?.index === index;
              const Icon = getActivityIcon(activity);

              return (
                <ListItem 
                  key={start}
                  ref={isCurrent ? currentActivityRef : null}
                  sx={{
                    py: 0.5,
                    bgcolor: isCurrent ? 'action.selected' : 'transparent',
                    opacity: isCompleted ? 0.5 : 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon 
                      fontSize="small" 
                      color={isCurrent ? "primary" : isCompleted ? "disabled" : "action"} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={activity}
                    secondary={`${start} - ${end}`}
                    primaryTypographyProps={{
                      variant: 'body2',
                      color: isCompleted ? 'text.disabled' : 'text.primary'
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: isCompleted ? 'text.disabled' : 'text.secondary'
                    }}
                  />
                </ListItem>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default ScheduleWidget;
