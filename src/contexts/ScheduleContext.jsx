import { createContext, useContext, useState, useEffect } from 'react';

const DAILY_SCHEDULE = [
    ["07:30", "08:00", "Exercise"],
    ["08:00", "08:15", "Quick shower/change"],
    ["08:15", "09:15", "Day job block 1"],
    ["09:15", "09:30", "Food prep + break"],
    ["09:30", "10:00", "Music projects"],
    ["10:00", "11:30", "Coding project block 1"],
    ["11:30", "12:15", "Cook and eat lunch"],
    ["12:15", "13:45", "Coding project block 2"],
    ["13:45", "14:15", "Market strategy study"],
    ["14:15", "14:45", "Trading strategy research"],
    ["14:45", "17:00", "Day job remaining time"],
];

const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

const ScheduleContext = createContext(null);

export const ScheduleProvider = ({ children }) => {
    const [currentActivity, setCurrentActivity] = useState(null);
    const [nextActivity, setNextActivity] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [progress, setProgress] = useState(0);
    const [schedule, setSchedule] = useState(DAILY_SCHEDULE);

    useEffect(() => {
        const updateSchedule = () => {
            const now = new Date();
            
            let current = null;
            let next = null;

            for (let i = 0; i < schedule.length; i++) {
                const [startTime, endTime, activity] = schedule[i];
                const start = parseTime(startTime);
                const end = parseTime(endTime);
                
                if (now >= start && now < end) {
                    current = {
                        activity,
                        startTime: start,
                        endTime: end,
                        index: i
                    };
                    next = i < schedule.length - 1 ? {
                        activity: schedule[i + 1][2],
                        startTime: parseTime(schedule[i + 1][0]),
                        endTime: parseTime(schedule[i + 1][1]),
                        index: i + 1
                    } : null;
                    break;
                }
            }

            if (current) {
                const duration = current.endTime - current.startTime;
                const elapsed = now - current.startTime;
                const remaining = Math.max(0, current.endTime - now);
                setProgress((elapsed / duration) * 100);
                setTimeRemaining(remaining);
                setCurrentActivity(current);
                setNextActivity(next);
            } else {
                setCurrentActivity(null);
                setNextActivity(null);
                setTimeRemaining(0);
                setProgress(0);
            }
        };

        updateSchedule();
        const interval = setInterval(updateSchedule, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [schedule]);

    const value = {
        schedule,
        setSchedule,
        currentActivity,
        nextActivity,
        timeRemaining,
        progress
    };

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error('useSchedule must be used within a ScheduleProvider');
    }
    return context;
};
