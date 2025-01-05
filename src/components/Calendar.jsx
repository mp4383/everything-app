import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  IconButton,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  Groups as MeetingIcon
} from '@mui/icons-material';
import { mockCalendarEvents } from '../mockData';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState("2024-01-10");
  
  const currentDayEvents = mockCalendarEvents.find(day => day.date === currentDate)?.events || [];
  
  const handlePrevDay = () => {
    const index = mockCalendarEvents.findIndex(day => day.date === currentDate);
    if (index > 0) {
      setCurrentDate(mockCalendarEvents[index - 1].date);
    }
  };

  const handleNextDay = () => {
    const index = mockCalendarEvents.findIndex(day => day.date === currentDate);
    if (index < mockCalendarEvents.length - 1) {
      setCurrentDate(mockCalendarEvents[index + 1].date);
    }
  };

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
        Calendar
      </Typography>
      
      <Stack spacing={2} sx={{ p: 2, flex: 1, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <IconButton onClick={handlePrevDay} disabled={currentDate === mockCalendarEvents[0].date}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6">
            {new Date(currentDate).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
          <IconButton 
            onClick={handleNextDay} 
            disabled={currentDate === mockCalendarEvents[mockCalendarEvents.length - 1].date}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>

        <Box sx={{ overflow: 'auto', flex: 1, bgcolor: '#fafafa', p: 2, mx: -2 }}>
          <Stack spacing={2}>
            {currentDayEvents.map((event) => (
              <Card key={event.id} variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" color="text.secondary">
                        {event.time}
                      </Typography>
                      <Chip
                        icon={event.type === 'meeting' ? <MeetingIcon /> : <EventIcon />}
                        label={event.type}
                        size="small"
                        color={event.type === 'meeting' ? 'secondary' : 'primary'}
                        variant="outlined"
                      />
                    </Stack>
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Calendar;
