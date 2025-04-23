
import axios from 'axios';

export interface FoodItem {
  id: string;
  name: string;
  image?: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  serving: string;
  servingSize: number;
  servingUnit: string;
}

export interface MealEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: FoodItem[];
  notes?: string;
}

// localStorage keys
const MEAL_ENTRIES_KEY = 'health_rhythm_meal_entries';
const FOOD_SEARCH_HISTORY = 'health_rhythm_food_search_history';

// API configuration (for a real app)
const API_URL = 'https://api.edamam.com/api/food-database/v2/parser';
const APP_ID = 'your-app-id';
const APP_KEY = 'your-app-key';

export const searchFoodItems = async (query: string): Promise<FoodItem[]> => {
  try {
    // In a real app, you would call the actual API
    // For demo purposes, we'll use mock data
    if (!query) return [];
    
    // Check if we have cached results
    const searchHistory = getSearchHistory();
    const cached = searchHistory[query.toLowerCase()];
    
    if (cached) {
      return cached;
    }
    
    // For demo, filter mock data by query
    const results = mockFoodItems.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Save to search history cache
    if (results.length > 0) {
      searchHistory[query.toLowerCase()] = results;
      localStorage.setItem(FOOD_SEARCH_HISTORY, JSON.stringify(searchHistory));
    }
    
    return results;
  } catch (error) {
    console.error('Error searching food items:', error);
    return [];
  }
};

export const saveMealEntry = (mealEntry: Omit<MealEntry, 'id'>): MealEntry => {
  const entries = getAllMealEntries();
  
  const newEntry: MealEntry = {
    ...mealEntry,
    id: Date.now().toString(),
  };
  
  entries.push(newEntry);
  localStorage.setItem(MEAL_ENTRIES_KEY, JSON.stringify(entries));
  
  return newEntry;
};

export const getAllMealEntries = (): MealEntry[] => {
  const entriesJson = localStorage.getItem(MEAL_ENTRIES_KEY);
  if (!entriesJson) return [];
  
  try {
    return JSON.parse(entriesJson);
  } catch (e) {
    console.error('Error parsing meal entries:', e);
    return [];
  }
};

export const deleteMealEntry = (id: string): boolean => {
  const entries = getAllMealEntries();
  const updatedEntries = entries.filter(e => e.id !== id);
  
  if (entries.length === updatedEntries.length) {
    return false;
  }
  
  localStorage.setItem(MEAL_ENTRIES_KEY, JSON.stringify(updatedEntries));
  return true;
};

export const updateMealEntry = (updatedEntry: MealEntry): boolean => {
  const entries = getAllMealEntries();
  const index = entries.findIndex(e => e.id === updatedEntry.id);
  
  if (index === -1) {
    return false;
  }
  
  entries[index] = updatedEntry;
  localStorage.setItem(MEAL_ENTRIES_KEY, JSON.stringify(entries));
  return true;
};

const getSearchHistory = (): { [key: string]: FoodItem[] } => {
  const historyJson = localStorage.getItem(FOOD_SEARCH_HISTORY);
  if (!historyJson) return {};
  
  try {
    return JSON.parse(historyJson);
  } catch (e) {
    console.error('Error parsing search history:', e);
    return {};
  }
};

export const getDailyNutritionSummary = (date: string): { 
  calories: number; 
  protein: number; 
  fat: number; 
  carbs: number;
  mealDistribution: { [key: string]: number };
} => {
  const entries = getAllMealEntries();
  const dayEntries = entries.filter(e => e.date.split('T')[0] === date.split('T')[0]);
  
  const summary = {
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
  };
  
  dayEntries.forEach(entry => {
    entry.foodItems.forEach(food => {
      summary.calories += food.calories;
      summary.protein += food.protein;
      summary.fat += food.fat;
      summary.carbs += food.carbs;
      summary.mealDistribution[entry.mealType] += food.calories;
    });
  });
  
  return summary;
};

export const getNutritionalGoals = () => {
  // In a real app, these would be customized by the user
  return {
    calories: 2000,
    protein: 80, // grams
    fat: 65, // grams
    carbs: 250 // grams
  };
};

// Initialize with some sample data if empty
export const initializeWithSampleData = () => {
  if (getAllMealEntries().length === 0) {
    const today = new Date().toISOString().split('T')[0];
    
    const sampleEntries: Omit<MealEntry, 'id'>[] = [
      {
        date: today,
        mealType: 'breakfast',
        foodItems: [
          mockFoodItems[0],
          mockFoodItems[4]
        ]
      },
      {
        date: today,
        mealType: 'lunch',
        foodItems: [
          mockFoodItems[2],
          mockFoodItems[7]
        ]
      },
      {
        date: today,
        mealType: 'dinner',
        foodItems: [
          mockFoodItems[3],
          mockFoodItems[6],
          mockFoodItems[8]
        ]
      }
    ];
    
    sampleEntries.forEach(entry => saveMealEntry(entry));
  }
};

// Mock data for development/demo
export const mockFoodItems: FoodItem[] = [
  {
    id: 'f1',
    name: 'Greek Yogurt',
    image: 'https://via.placeholder.com/100?text=Yogurt',
    calories: 130,
    protein: 17,
    fat: 0,
    carbs: 9,
    serving: 'container',
    servingSize: 170,
    servingUnit: 'g'
  },
  {
    id: 'f2',
    name: 'Whole Wheat Bread',
    image: 'https://via.placeholder.com/100?text=Bread',
    calories: 80,
    protein: 4,
    fat: 0.5,
    carbs: 15,
    serving: 'slice',
    servingSize: 30,
    servingUnit: 'g'
  },
  {
    id: 'f3',
    name: 'Grilled Chicken Breast',
    image: 'https://via.placeholder.com/100?text=Chicken',
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
    serving: 'breast',
    servingSize: 100,
    servingUnit: 'g'
  },
  {
    id: 'f4',
    name: 'Salmon Fillet',
    image: 'https://via.placeholder.com/100?text=Salmon',
    calories: 208,
    protein: 20,
    fat: 13,
    carbs: 0,
    serving: 'fillet',
    servingSize: 100,
    servingUnit: 'g'
  },
  {
    id: 'f5',
    name: 'Oatmeal',
    image: 'https://via.placeholder.com/100?text=Oatmeal',
    calories: 150,
    protein: 5,
    fat: 3,
    carbs: 27,
    serving: 'bowl',
    servingSize: 40,
    servingUnit: 'g'
  },
  {
    id: 'f6',
    name: 'Apple',
    image: 'https://via.placeholder.com/100?text=Apple',
    calories: 95,
    protein: 0.5,
    fat: 0.3,
    carbs: 25,
    serving: 'medium',
    servingSize: 182,
    servingUnit: 'g'
  },
  {
    id: 'f7',
    name: 'Broccoli',
    image: 'https://via.placeholder.com/100?text=Broccoli',
    calories: 55,
    protein: 3.7,
    fat: 0.6,
    carbs: 11,
    serving: 'cup',
    servingSize: 156,
    servingUnit: 'g'
  },
  {
    id: 'f8',
    name: 'Brown Rice',
    image: 'https://via.placeholder.com/100?text=Rice',
    calories: 216,
    protein: 5,
    fat: 1.8,
    carbs: 45,
    serving: 'cup',
    servingSize: 195,
    servingUnit: 'g'
  },
  {
    id: 'f9',
    name: 'Sweet Potato',
    image: 'https://via.placeholder.com/100?text=Sweet+Potato',
    calories: 112,
    protein: 2,
    fat: 0.1,
    carbs: 26,
    serving: 'medium',
    servingSize: 130,
    servingUnit: 'g'
  },
  {
    id: 'f10',
    name: 'Avocado',
    image: 'https://via.placeholder.com/100?text=Avocado',
    calories: 234,
    protein: 2.9,
    fat: 21,
    carbs: 12,
    serving: 'whole',
    servingSize: 150,
    servingUnit: 'g'
  }
];
