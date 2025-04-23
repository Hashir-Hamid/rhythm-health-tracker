
import { format } from 'date-fns';

export interface FitnessActivity {
  id: string;
  date: string;
  activityType: 'running' | 'walking' | 'cycling' | 'swimming' | 'yoga' | 'strength' | 'other';
  duration: number; // in minutes
  calories: number;
  distance?: number; // in km
  notes?: string;
}

// localStorage keys
const FITNESS_ACTIVITIES_KEY = 'health_rhythm_fitness_activities';

export const saveActivity = (activity: Omit<FitnessActivity, 'id'>): FitnessActivity => {
  const activities = getAllActivities();
  
  const newActivity: FitnessActivity = {
    ...activity,
    id: Date.now().toString(),
  };
  
  activities.push(newActivity);
  localStorage.setItem(FITNESS_ACTIVITIES_KEY, JSON.stringify(activities));
  
  return newActivity;
};

export const getAllActivities = (): FitnessActivity[] => {
  const activitiesJson = localStorage.getItem(FITNESS_ACTIVITIES_KEY);
  if (!activitiesJson) return [];
  
  try {
    return JSON.parse(activitiesJson);
  } catch (e) {
    console.error('Error parsing fitness activities:', e);
    return [];
  }
};

export const deleteActivity = (id: string): boolean => {
  const activities = getAllActivities();
  const updatedActivities = activities.filter(a => a.id !== id);
  
  if (activities.length === updatedActivities.length) {
    return false;
  }
  
  localStorage.setItem(FITNESS_ACTIVITIES_KEY, JSON.stringify(updatedActivities));
  return true;
};

export const updateActivity = (updatedActivity: FitnessActivity): boolean => {
  const activities = getAllActivities();
  const index = activities.findIndex(a => a.id === updatedActivity.id);
  
  if (index === -1) {
    return false;
  }
  
  activities[index] = updatedActivity;
  localStorage.setItem(FITNESS_ACTIVITIES_KEY, JSON.stringify(activities));
  return true;
};

export const getWeeklySummary = (): { date: string, calories: number, duration: number }[] => {
  const activities = getAllActivities();
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 6);
  
  // Create an array for the last 7 days
  const days = Array(7).fill(0).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return {
      date: format(date, 'yyyy-MM-dd'),
      displayDate: format(date, 'E'),
      calories: 0,
      duration: 0
    };
  });
  
  // Fill in the data from activities
  activities.forEach(activity => {
    const activityDate = activity.date.split('T')[0];
    const dayIndex = days.findIndex(day => day.date === activityDate);
    
    if (dayIndex !== -1) {
      days[dayIndex].calories += activity.calories;
      days[dayIndex].duration += activity.duration;
    }
  });
  
  return days.map(day => ({
    date: day.displayDate,
    calories: day.calories,
    duration: day.duration
  }));
};

export const getMonthlySummaryByType = (): { 
  date: string, 
  running: number, 
  walking: number, 
  cycling: number, 
  swimming: number, 
  yoga: number, 
  strength: number, 
  other: number 
}[] => {
  const activities = getAllActivities();
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setDate(today.getDate() - 30);
  
  // Group activities by week
  const weeklyData: { [key: string]: { 
    running: number, 
    walking: number, 
    cycling: number, 
    swimming: number, 
    yoga: number, 
    strength: number, 
    other: number 
  } } = {};
  
  activities.forEach(activity => {
    const activityDate = new Date(activity.date);
    
    if (activityDate >= lastMonth && activityDate <= today) {
      // Get week number
      const weekStart = new Date(activityDate);
      weekStart.setDate(activityDate.getDate() - activityDate.getDay());
      const weekKey = format(weekStart, 'MMM d');
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          running: 0,
          walking: 0,
          cycling: 0,
          swimming: 0,
          yoga: 0,
          strength: 0,
          other: 0
        };
      }
      
      // Add activity duration to the appropriate type
      weeklyData[weekKey][activity.activityType] += activity.duration;
    }
  });
  
  // Convert to array format for chart
  return Object.keys(weeklyData).map(week => ({
    date: week,
    ...weeklyData[week]
  }));
};

// Initialize with some sample data if empty
export const initializeWithSampleData = () => {
  if (getAllActivities().length === 0) {
    const today = new Date();
    
    const sampleActivities: Omit<FitnessActivity, 'id'>[] = [
      {
        date: format(today, 'yyyy-MM-dd'),
        activityType: 'running',
        duration: 30,
        calories: 320,
        distance: 4.2
      },
      {
        date: format(new Date(today.setDate(today.getDate() - 1)), 'yyyy-MM-dd'),
        activityType: 'cycling',
        duration: 45,
        calories: 410,
        distance: 15
      },
      {
        date: format(new Date(today.setDate(today.getDate() - 1)), 'yyyy-MM-dd'),
        activityType: 'walking',
        duration: 60,
        calories: 280,
        distance: 5.1
      },
      {
        date: format(new Date(today.setDate(today.getDate() - 2)), 'yyyy-MM-dd'),
        activityType: 'yoga',
        duration: 40,
        calories: 180
      },
      {
        date: format(new Date(today.setDate(today.getDate() - 3)), 'yyyy-MM-dd'),
        activityType: 'strength',
        duration: 50,
        calories: 350
      },
      {
        date: format(new Date(today.setDate(today.getDate() - 4)), 'yyyy-MM-dd'),
        activityType: 'running',
        duration: 25,
        calories: 280,
        distance: 3.8
      }
    ];
    
    sampleActivities.forEach(activity => saveActivity(activity));
  }
};
