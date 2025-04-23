
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Apple, Search, PlusCircle, Trash2, Calendar } from "lucide-react";
import {
  FoodItem,
  MealEntry,
  searchFoodItems,
  saveMealEntry,
  getAllMealEntries,
  deleteMealEntry,
  getDailyNutritionSummary,
  getNutritionalGoals,
  initializeWithSampleData,
} from "@/services/nutritionService";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Nutrition = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [nutritionSummary, setNutritionSummary] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    mealDistribution: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    }
  });
  const [nutritionalGoals, setNutritionalGoals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  });
  
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      mealType: "breakfast",
      notes: "",
    },
  });

  useEffect(() => {
    // Initialize with sample data if needed
    initializeWithSampleData();
    
    // Load user's meals
    loadMeals();
    
    // Load nutritional goals
    setNutritionalGoals(getNutritionalGoals());
  }, []);

  useEffect(() => {
    // Update nutrition summary when selected date changes
    updateNutritionSummary();
  }, [selectedDate, meals]);

  const loadMeals = () => {
    const allMeals = getAllMealEntries();
    setMeals(allMeals.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  };

  const updateNutritionSummary = () => {
    const summary = getDailyNutritionSummary(selectedDate);
    setNutritionSummary(summary);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchFoodItems(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching food items:", error);
      toast({
        title: "Error searching foods",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFood = (food: FoodItem) => {
    setSelectedFoods([...selectedFoods, food]);
    // Clear search results
    setSearchResults([]);
    setSearchTerm("");
  };

  const handleRemoveFood = (index: number) => {
    const updatedFoods = [...selectedFoods];
    updatedFoods.splice(index, 1);
    setSelectedFoods(updatedFoods);
  };

  const onSubmit = (data: any) => {
    if (selectedFoods.length === 0) {
      toast({
        title: "No foods selected",
        description: "Please select at least one food item",
        variant: "destructive",
      });
      return;
    }

    try {
      const mealEntry: Omit<MealEntry, "id"> = {
        date: selectedDate,
        mealType: data.mealType,
        foodItems: selectedFoods,
        notes: data.notes || undefined,
      };

      saveMealEntry(mealEntry);
      toast({
        title: "Meal logged successfully",
        description: `Added ${selectedFoods.length} food items to your ${data.mealType}`,
      });
      
      // Reset form
      reset();
      setSelectedFoods([]);
      
      // Reload meals and update summary
      loadMeals();
    } catch (error) {
      console.error("Error saving meal entry:", error);
      toast({
        title: "Error saving meal",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeal = (id: string) => {
    try {
      deleteMealEntry(id);
      toast({
        title: "Meal deleted",
      });
      
      // Reload meals and update summary
      loadMeals();
    } catch (error) {
      console.error("Error deleting meal:", error);
      toast({
        title: "Error deleting meal",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getMealTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      breakfast: "🍳",
      lunch: "🥗",
      dinner: "🍲",
      snack: "🍎"
    };
    return icons[type] || "🍽️";
  };

  const calculatePercentage = (value: number, goal: number) => {
    if (goal <= 0) return 0;
    return Math.min(Math.round((value / goal) * 100), 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nutrition Tracker</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Track your meals and monitor your nutritional intake.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Date selector */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Summary</h2>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-green focus:border-health-green text-sm"
                />
              </div>
            </div>

            {/* Calorie progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Calories</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {nutritionSummary.calories} / {nutritionalGoals.calories} kcal
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-health-green rounded-full"
                  style={{ width: `${calculatePercentage(nutritionSummary.calories, nutritionalGoals.calories)}%` }}
                ></div>
              </div>
            </div>

            {/* Protein progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Protein</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {nutritionSummary.protein} / {nutritionalGoals.protein} g
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-health-blue rounded-full"
                  style={{ width: `${calculatePercentage(nutritionSummary.protein, nutritionalGoals.protein)}%` }}
                ></div>
              </div>
            </div>

            {/* Fat progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fat</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {nutritionSummary.fat} / {nutritionalGoals.fat} g
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-health-orange rounded-full"
                  style={{ width: `${calculatePercentage(nutritionSummary.fat, nutritionalGoals.fat)}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carbs</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {nutritionSummary.carbs} / {nutritionalGoals.carbs} g
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-2 bg-health-purple rounded-full"
                  style={{ width: `${calculatePercentage(nutritionSummary.carbs, nutritionalGoals.carbs)}%` }}
                ></div>
              </div>
            </div>

            {/* Meal distribution */}
            {Object.keys(nutritionSummary.mealDistribution).some(
              key => nutritionSummary.mealDistribution[key as keyof typeof nutritionSummary.mealDistribution] > 0
            ) && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Distribution</h3>
                <div className="flex items-center">
                  {Object.entries(nutritionSummary.mealDistribution).map(([meal, calories], index) => {
                    if (calories <= 0) return null;
                    
                    const colors = ["bg-health-blue", "bg-health-green", "bg-health-purple", "bg-health-orange"];
                    const percentage = (calories / nutritionSummary.calories) * 100;
                    
                    return (
                      <div 
                        key={meal}
                        className={`${colors[index % colors.length]} h-4`}
                        style={{ width: `${percentage}%` }}
                        title={`${meal}: ${calories} calories (${Math.round(percentage)}%)`}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex text-xs text-gray-500 dark:text-gray-400 mt-1 justify-between">
                  {Object.entries(nutritionSummary.mealDistribution).map(([meal, calories], index) => {
                    if (calories <= 0) return null;
                    return (
                      <div key={meal} className="flex items-center">
                        <div className={`w-2 h-2 rounded-full bg-${index === 0 ? 'health-blue' : index === 1 ? 'health-green' : index === 2 ? 'health-purple' : 'health-orange'} mr-1`}></div>
                        {meal.charAt(0).toUpperCase() + meal.slice(1)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Add new meal form */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Meal
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search Foods
                </label>
                <div className="flex">
                  <input
                    id="search"
                    type="text"
                    placeholder="Search for foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-green focus:border-health-green"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-4 py-2 bg-health-green hover:bg-health-green/90 text-white rounded-r-md border border-health-green"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 border rounded-md shadow-sm max-h-60 overflow-y-auto">
                    {searchResults.map((food) => (
                      <div 
                        key={food.id}
                        className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between cursor-pointer border-b last:border-b-0"
                        onClick={() => handleAddFood(food)}
                      >
                        <div className="flex items-center">
                          {food.image ? (
                            <img src={food.image} alt={food.name} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                              <Apple className="h-6 w-6" />
                            </div>
                          )}
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{food.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {food.calories} cal | {food.serving}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-health-green hover:bg-health-green/10 p-1 rounded-full"
                        >
                          <PlusCircle className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Selected foods */}
              {selectedFoods.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Foods</h3>
                  <div className="border rounded-md shadow-sm max-h-60 overflow-y-auto">
                    {selectedFoods.map((food, index) => (
                      <div 
                        key={`${food.id}-${index}`}
                        className="p-2 border-b last:border-b-0 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {food.image ? (
                            <img src={food.image} alt={food.name} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                              <Apple className="h-6 w-6" />
                            </div>
                          )}
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{food.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {food.calories} cal | P: {food.protein}g | F: {food.fat}g | C: {food.carbs}g
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFood(index)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    <p className="text-sm font-medium flex justify-between">
                      <span>Total calories:</span>
                      <span>{selectedFoods.reduce((sum, food) => sum + food.calories, 0)} cal</span>
                    </p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div>
                  <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meal Type
                  </label>
                  <select
                    id="mealType"
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-green focus:border-health-green"
                    {...register("mealType", { required: true })}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-health-green focus:border-health-green"
                    placeholder="Any notes about this meal..."
                    {...register("notes")}
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={selectedFoods.length === 0}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-health-green hover:bg-health-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-health-green disabled:opacity-50"
                  >
                    Log Meal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Apple className="h-5 w-5 mr-2 text-health-green" />
                Meal History
              </h2>
            </div>
            
            {meals.length > 0 ? (
              <div className="divide-y">
                {meals.filter(meal => {
                  // Show all meals from the selected date
                  return meal.date.split('T')[0] === selectedDate;
                }).map((meal) => (
                  <div key={meal.id} className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getMealTypeIcon(meal.mealType)}</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                          {meal.mealType}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(meal.date), "MMM d, yyyy")}
                        </span>
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="text-gray-400 hover:text-red-500 focus:outline-none ml-3"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {meal.foodItems.map((food, index) => (
                        <div key={index} className="flex items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
                          {food.image ? (
                            <img src={food.image} alt={food.name} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                              <Apple className="h-6 w-6" />
                            </div>
                          )}
                          <div className="ml-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{food.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {food.calories} cal | P: {food.protein}g | F: {food.fat}g | C: {food.carbs}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {meal.notes && (
                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <p className="italic">{meal.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Total:</span>
                        <span>
                          {meal.foodItems.reduce((sum, food) => sum + food.calories, 0)} cal | 
                          P: {meal.foodItems.reduce((sum, food) => sum + food.protein, 0)}g | 
                          F: {meal.foodItems.reduce((sum, food) => sum + food.fat, 0)}g | 
                          C: {meal.foodItems.reduce((sum, food) => sum + food.carbs, 0)}g
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No meals logged yet. Start by adding your first meal!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
