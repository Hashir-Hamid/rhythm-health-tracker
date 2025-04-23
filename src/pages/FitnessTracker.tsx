
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dumbbell, CalendarIcon, Trash2, LineChart } from "lucide-react";
import {
  FitnessActivity,
  saveActivity,
  getAllActivities,
  deleteActivity,
  getWeeklySummary,
  getMonthlySummaryByType,
} from "@/services/fitnessService";
import ActivityChart, { ActivityData } from "@/components/Charts/ActivityChart";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface FitnessFormData {
  date: string;
  activityType: "running" | "walking" | "cycling" | "swimming" | "yoga" | "strength" | "other";
  duration: number;
  calories: number;
  distance?: number;
  notes?: string;
}

const FitnessTracker = () => {
  const [activities, setActivities] = useState<FitnessActivity[]>([]);
  const [weeklyData, setWeeklyData] = useState<ActivityData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ActivityData[]>([]);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FitnessFormData>({
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      activityType: "running",
      duration: 30,
      calories: 300,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load activities
    const allActivities = getAllActivities();
    setActivities(allActivities.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    
    // Load weekly data for chart
    setWeeklyData(getWeeklySummary());
    
    // Load monthly data by activity type
    setMonthlyData(getMonthlySummaryByType());
  };

  const onSubmit = (data: FitnessFormData) => {
    try {
      saveActivity(data);
      toast({
        title: "Activity logged successfully",
        description: `You logged ${data.duration} minutes of ${data.activityType}`,
      });
      reset();
      loadData();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast({
        title: "Error saving activity",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteActivity(id);
      toast({
        title: "Activity deleted",
      });
      loadData();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast({
        title: "Error deleting activity",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getActivityTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      running: "bg-health-blue text-white",
      walking: "bg-health-green text-white",
      cycling: "bg-health-teal text-white",
      swimming: "bg-health-indigo text-white",
      yoga: "bg-health-purple text-white",
      strength: "bg-health-amber text-black",
      other: "bg-health-orange text-white",
    };
    return colors[type] || "bg-gray-500 text-white";
  };

  const calculateTotalStats = () => {
    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const thisWeeksActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startOfWeek && activityDate <= today;
    });
    
    return {
      totalDuration: thisWeeksActivities.reduce((sum, activity) => sum + activity.duration, 0),
      totalCalories: thisWeeksActivities.reduce((sum, activity) => sum + activity.calories, 0),
      totalActivities: thisWeeksActivities.length,
    };
  };

  const stats = calculateTotalStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fitness Tracker</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Track your exercise and physical activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border flex flex-col items-center">
          <div className="rounded-full p-3 bg-health-blue/10 text-health-blue mb-2">
            <Dumbbell className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold">{stats.totalActivities}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Activities This Week</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border flex flex-col items-center">
          <div className="rounded-full p-3 bg-health-green/10 text-health-green mb-2">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold">{stats.totalDuration} min</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Minutes This Week</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border flex flex-col items-center">
          <div className="rounded-full p-3 bg-health-teal/10 text-health-teal mb-2">
            <LineChart className="h-6 w-6" />
          </div>
          <p className="text-lg font-semibold">{stats.totalCalories} kcal</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Calories Burned This Week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityChart 
          data={weeklyData} 
          type="area"
          title="Weekly Activity Duration (minutes)" 
        />
        
        <ActivityChart 
          data={monthlyData.slice(0, 5)} 
          type="bar"
          title="Activities by Type (last 30 days)" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Log New Activity
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-blue focus:border-health-blue"
                  {...register("date", { required: true })}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    Date is required
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="activityType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Activity Type
                </label>
                <select
                  id="activityType"
                  className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-blue focus:border-health-blue"
                  {...register("activityType", { required: true })}
                >
                  <option value="running">Running</option>
                  <option value="walking">Walking</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                  <option value="yoga">Yoga</option>
                  <option value="strength">Strength Training</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (min)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-blue focus:border-health-blue"
                    {...register("duration", { 
                      required: "Duration is required",
                      min: { value: 1, message: "Duration must be positive" }
                    })}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Calories
                  </label>
                  <input
                    id="calories"
                    type="number"
                    min="0"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-blue focus:border-health-blue"
                    {...register("calories", { 
                      required: "Calories is required",
                      min: { value: 0, message: "Calories must be non-negative" }
                    })}
                  />
                  {errors.calories && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                      {errors.calories.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Distance (km, optional)
                </label>
                <input
                  id="distance"
                  type="number"
                  step="0.01"
                  min="0"
                  className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-blue focus:border-health-blue"
                  {...register("distance", { 
                    min: { value: 0, message: "Distance must be non-negative" }
                  })}
                />
                {errors.distance && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.distance.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-blue focus:border-health-blue"
                  placeholder="How did your workout feel?"
                  {...register("notes")}
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-health-blue hover:bg-health-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-health-blue"
                >
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-health-blue" />
                Recent Activities
              </h2>
            </div>
            
            {activities.length > 0 ? (
              <div className="divide-y">
                {activities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${getActivityTypeColor(activity.activityType)}`}>
                        {activity.activityType.charAt(0).toUpperCase()}
                      </span>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1)}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>{format(parseISO(activity.date), "MMM d, yyyy")}</span>
                          <span className="mx-1">•</span>
                          <span>{activity.duration} min</span>
                          {activity.distance && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{activity.distance} km</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.calories} cal
                      </span>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-gray-400 hover:text-red-500 focus:outline-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No activities logged yet. Start by adding your first activity!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessTracker;
