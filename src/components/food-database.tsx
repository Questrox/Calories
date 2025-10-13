export interface FoodProduct {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
  category: string;
}

export const foodDatabase: FoodProduct[] = [
  // Зерновые и крупы
  {
    id: "oats",
    name: "Овсяная каша",
    caloriesPer100g: 342,
    proteinPer100g: 12.3,
    fatPer100g: 6.1,
    carbsPer100g: 59.5,
    category: "Зерновые"
  },
  {
    id: "rice",
    name: "Рис белый",
    caloriesPer100g: 344,
    proteinPer100g: 6.7,
    fatPer100g: 0.7,
    carbsPer100g: 78.9,
    category: "Зерновые"
  },
  {
    id: "buckwheat",
    name: "Гречка",
    caloriesPer100g: 313,
    proteinPer100g: 12.6,
    fatPer100g: 3.3,
    carbsPer100g: 57.1,
    category: "Зерновые"
  },

  // Мясо и птица
  {
    id: "chicken-breast",
    name: "Куриная грудка",
    caloriesPer100g: 165,
    proteinPer100g: 31.0,
    fatPer100g: 3.6,
    carbsPer100g: 0.0,
    category: "Мясо"
  },
  {
    id: "beef",
    name: "Говядина",
    caloriesPer100g: 187,
    proteinPer100g: 18.9,
    fatPer100g: 12.4,
    carbsPer100g: 0.0,
    category: "Мясо"
  },
  {
    id: "turkey",
    name: "Индейка",
    caloriesPer100g: 157,
    proteinPer100g: 21.6,
    fatPer100g: 7.4,
    carbsPer100g: 0.0,
    category: "Мясо"
  },

  // Рыба
  {
    id: "salmon",
    name: "Семга",
    caloriesPer100g: 208,
    proteinPer100g: 20.4,
    fatPer100g: 13.6,
    carbsPer100g: 0.0,
    category: "Рыба"
  },
  {
    id: "tuna",
    name: "Тунец",
    caloriesPer100g: 144,
    proteinPer100g: 23.0,
    fatPer100g: 4.9,
    carbsPer100g: 0.0,
    category: "Рыба"
  },

  // Молочные продукты
  {
    id: "cottage-cheese",
    name: "Творог 9%",
    caloriesPer100g: 169,
    proteinPer100g: 16.7,
    fatPer100g: 9.0,
    carbsPer100g: 2.0,
    category: "Молочные"
  },
  {
    id: "milk",
    name: "Молоко 3.2%",
    caloriesPer100g: 60,
    proteinPer100g: 2.9,
    fatPer100g: 3.2,
    carbsPer100g: 4.7,
    category: "Молочные"
  },
  {
    id: "yogurt",
    name: "Йогурт натуральный",
    caloriesPer100g: 66,
    proteinPer100g: 5.0,
    fatPer100g: 3.2,
    carbsPer100g: 3.5,
    category: "Молочные"
  },

  // Овощи
  {
    id: "broccoli",
    name: "Брокколи",
    caloriesPer100g: 25,
    proteinPer100g: 3.0,
    fatPer100g: 0.4,
    carbsPer100g: 2.6,
    category: "Овощи"
  },
  {
    id: "carrot",
    name: "Морковь",
    caloriesPer100g: 35,
    proteinPer100g: 1.3,
    fatPer100g: 0.1,
    carbsPer100g: 6.9,
    category: "Овощи"
  },
  {
    id: "tomato",
    name: "Помидор",
    caloriesPer100g: 20,
    proteinPer100g: 1.1,
    fatPer100g: 0.2,
    carbsPer100g: 2.6,
    category: "Овощи"
  },

  // Фрукты
  {
    id: "apple",
    name: "Яблоко",
    caloriesPer100g: 47,
    proteinPer100g: 0.4,
    fatPer100g: 0.4,
    carbsPer100g: 9.8,
    category: "Фрукты"
  },
  {
    id: "banana",
    name: "Банан",
    caloriesPer100g: 96,
    proteinPer100g: 1.5,
    fatPer100g: 0.2,
    carbsPer100g: 21.0,
    category: "Фрукты"
  },

  // Орехи
  {
    id: "almonds",
    name: "Миндаль",
    caloriesPer100g: 645,
    proteinPer100g: 18.6,
    fatPer100g: 57.7,
    carbsPer100g: 16.2,
    category: "Орехи"
  },
  {
    id: "walnuts",
    name: "Грецкие орехи",
    caloriesPer100g: 656,
    proteinPer100g: 16.2,
    fatPer100g: 60.8,
    carbsPer100g: 11.1,
    category: "Орехи"
  },

  // Яйца
  {
    id: "eggs",
    name: "Куриные яйца",
    caloriesPer100g: 155,
    proteinPer100g: 12.7,
    fatPer100g: 10.9,
    carbsPer100g: 0.7,
    category: "Яйца"
  }
];

export function searchFoods(query: string): FoodProduct[] {
  if (!query.trim()) return foodDatabase;
  
  const lowercaseQuery = query.toLowerCase().trim();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery) ||
    food.category.toLowerCase().includes(lowercaseQuery)
  );
}

export function calculateNutrients(product: FoodProduct, weightInGrams: number) {
  const factor = weightInGrams / 100;
  return {
    calories: Math.round(product.caloriesPer100g * factor),
    protein: Math.round(product.proteinPer100g * factor * 10) / 10,
    fat: Math.round(product.fatPer100g * factor * 10) / 10,
    carbs: Math.round(product.carbsPer100g * factor * 10) / 10,
  };
}