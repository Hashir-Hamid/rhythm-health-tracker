
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, HeartPulse, Apple, Dumbbell } from "lucide-react";
import StatCard from "@/components/Dashboard/StatCard";
import ActivityChart, { ActivityData } from "@/components/Charts/ActivityChart";
import { getWeeklySummary, initializeWithSampleData as initFitnessData } from "@/services/fitnessService";
import { getDailyNutritionSummary, getNutritionalGoals, initializeWithSampleData as initNutritionData } from "@/services/nutritionService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activityData, setActivityData] = React.useState<ActivityData[]>([]);
  const [dailyNutrition, setDailyNutrition] = React.useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  });
  const [nutritionGoals, setNutritionGoals] = React.useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  });

  useEffect(() => {
    // Initialize sample data
    initFitnessData();
    initNutritionData();
    
    // Get weekly fitness summary
    const weeklyData = getWeeklySummary();
    setActivityData(weeklyData);
    
    // Get today's nutrition summary
    const today = new Date().toISOString().split('T')[0];
    const todayNutrition = getDailyNutritionSummary(today);
    setDailyNutrition(todayNutrition);
    
    // Get nutrition goals
    setNutritionGoals(getNutritionalGoals());
    
    // Welcome toast
    toast({
      title: "Welcome to HealthRhythm",
      description: "Your personal health companion",
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to HealthRhythm
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your personal health companion, tracking your wellness journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/fitness" className="block">
          <StatCard
            title="Weekly Activity"
            value={`${activityData.reduce((acc, curr) => acc + curr.duration, 0)} mins`}
            icon={<Dumbbell className="h-5 w-5 text-health-blue" />}
            color="bg-health-blue"
            description="Your total activity this week"
            trend={{ value: 12, isPositive: true }}
          />
        </Link>
        <Link to="/nutrition" className="block">
          <StatCard
            title="Daily Calories"
            value={`${dailyNutrition.calories} / ${nutritionGoals.calories}`}
            icon={<Apple className="h-5 w-5 text-health-green" />}
            color="bg-health-green"
            description="Consumption vs. goal today"
          />
        </Link>
        <Link to="/symptoms" className="block">
          <StatCard
            title="Symptom Check"
            value="Available"
            icon={<HeartPulse className="h-5 w-5 text-health-purple" />}
            color="bg-health-purple"
            description="Check your symptoms"
          />
        </Link>
        <Link to="/news" className="block">
          <StatCard
            title="Health News"
            value="5 new"
            icon={<Activity className="h-5 w-5 text-health-indigo" />}
            color="bg-health-indigo"
            description="Latest health updates"
          />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weekly Activity Overview</h2>
          <ActivityChart 
            data={activityData} 
            type="area" 
            title="Weekly Minutes" 
            dataKey="duration" 
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Daily Calorie Intake</h2>
          <ActivityChart 
            data={activityData} 
            type="bar"
            color="#10b981" 
            title="Weekly Calories" 
            dataKey="calories" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-lg shadow-sm overflow-hidden border">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/fitness" 
                className="flex items-center p-4 rounded-lg bg-health-blue bg-opacity-10 text-health-blue hover:bg-opacity-20 transition"
              >
                <Dumbbell className="h-5 w-5 mr-2" />
                <span>Log Activity</span>
              </Link>
              
              <Link 
                to="/nutrition" 
                className="flex items-center p-4 rounded-lg bg-health-green bg-opacity-10 text-health-green hover:bg-opacity-20 transition"
              >
                <Apple className="h-5 w-5 mr-2" />
                <span>Log Meal</span>
              </Link>
              
              <Link 
                to="/symptoms" 
                className="flex items-center p-4 rounded-lg bg-health-purple bg-opacity-10 text-health-purple hover:bg-opacity-20 transition"
              >
                <HeartPulse className="h-5 w-5 mr-2" />
                <span>Check Symptoms</span>
              </Link>
              
              <Link 
                to="/news" 
                className="flex items-center p-4 rounded-lg bg-health-indigo bg-opacity-10 text-health-indigo hover:bg-opacity-20 transition"
              >
                <Activity className="h-5 w-5 mr-2" />
                <span>Read News</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
