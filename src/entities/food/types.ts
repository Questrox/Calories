export interface FoodProduct {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
  category: string;
}

export interface FoodItem {
  id: string;
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface WaterEntry {
  id: string;
  amount: number;
}

export interface MealData {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
}