export interface DayMenu {
  day: number;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks?: string;
}

export interface MealPlanDetails {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  benefits: string[];
  warnings?: string[];
  macros: {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
  };
  weekMenu: DayMenu[];
}