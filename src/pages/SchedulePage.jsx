import { Box } from '@mui/material';
import ScheduleWidget from '../components/ScheduleWidget';

const SchedulePage = () => {
  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Box 
        sx={{ 
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          overflow: 'auto',
          border: 1,
          borderColor: '#e0e0e0'
        }}
      >
        <ScheduleWidget />
      </Box>
    </Box>
  );
};

export default SchedulePage;
