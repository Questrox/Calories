import React, { useState } from "react";
import { ScrollView, View, Text, Modal, Pressable, StyleSheet } from "react-native";
import MealSection from "../features/diary/meal-section";
import { WaterSection } from "../features/diary/water-section";
import { AddFoodDialog } from "../features/diary/add-food-dialog";
import { AddWaterDialog } from "../features/diary/add-water-dialog";
import DatePickerSimple from "../shared/ui/date-picker";
import { FoodItem, MealData, WaterEntry } from "../entities/food";

type MealType = "breakfast" | "lunch" | "dinner";

interface DiaryPageProps {
  meals: MealData;
  setMeals: React.Dispatch<React.SetStateAction<MealData>>;
  waterEntries: WaterEntry[];
  setWaterEntries: React.Dispatch<React.SetStateAction<WaterEntry[]>>;
}

export function DiaryPage({ meals, setMeals, waterEntries, setWaterEntries }: DiaryPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [waterDialogOpen, setWaterDialogOpen] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<MealType | null>(null);

  const allFoods = Object.values(meals).flat();
  const totalCalories = allFoods.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = allFoods.reduce((sum, item) => sum + item.protein, 0);
  const totalFat = allFoods.reduce((sum, item) => sum + item.fat, 0);
  const totalCarbs = allFoods.reduce((sum, item) => sum + item.carbs, 0);
  const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const getMealTitle = (meal: MealType) => {
    switch (meal) {
      case "breakfast": return "Завтрак";
      case "lunch": return "Обед";
      case "dinner": return "Ужин";
    }
  };

  const handleAddFood = (mealType: MealType) => {
    setCurrentMeal(mealType);
    setDialogOpen(true);
  };

  const handleFoodAdded = (foodData: Omit<FoodItem, "id">) => {
    if (!currentMeal) return;
    const newFood: FoodItem = { ...foodData, id: Date.now().toString() };
    setMeals(prev => ({ ...prev, [currentMeal]: [...prev[currentMeal], newFood] }));
  };

  const handleDeleteFood = (mealType: MealType, foodId: string) => {
    setMeals(prev => ({ ...prev, [mealType]: prev[mealType].filter(item => item.id !== foodId) }));
  };

  const handleAddWater = (amount: number) => {
    setWaterEntries(prev => [...prev, { id: Date.now().toString(), amount }]);
  };

  const handleDeleteWater = (id: string) => {
    setWaterEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Дневник питания</Text>
      <Text style={styles.subtitle}>Отслеживайте свое питание каждый день</Text>

      <DatePickerSimple date={selectedDate} onChange={setSelectedDate} />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Употреблено за день</Text>
        <Text style={styles.calories}>{totalCalories} ккал</Text>

        {totalCalories > 0 && (
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: "#60A5FA" }]}>{totalProtein}</Text>
              <Text style={styles.macroLabel}>Белки (г)</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: "#FB923C" }]}>{totalFat}</Text>
              <Text style={styles.macroLabel}>Жиры (г)</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: "#34D399" }]}>{totalCarbs}</Text>
              <Text style={styles.macroLabel}>Углеводы (г)</Text>
            </View>
          </View>
        )}

        {totalWater > 0 && (
          <View style={styles.waterBox}>
            <Text style={styles.waterValue}>
              {totalWater >= 1000 ? `${(totalWater / 1000).toFixed(2)} л` : `${totalWater} мл`}
            </Text>
            <Text style={styles.waterLabel}>Вода</Text>
          </View>
        )}
      </View>

      <MealSection title="🌅 Завтрак" items={meals.breakfast} onAdd={() => handleAddFood("breakfast")} onDelete={id => handleDeleteFood("breakfast", id)} showCalories />
      <MealSection title="☀️ Обед" items={meals.lunch} onAdd={() => handleAddFood("lunch")} onDelete={id => handleDeleteFood("lunch", id)} showCalories />
      <MealSection title="🌙 Ужин" items={meals.dinner} onAdd={() => handleAddFood("dinner")} onDelete={id => handleDeleteFood("dinner", id)} showCalories />

      <WaterSection entries={waterEntries} onAddWater={() => setWaterDialogOpen(true)} onDeleteWater={handleDeleteWater} />

      <AddFoodDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAddFood={handleFoodAdded} mealTitle={currentMeal ? getMealTitle(currentMeal) : "Приём пищи"} />
      <AddWaterDialog open={waterDialogOpen} onClose={() => setWaterDialogOpen(false)} onAdd={handleAddWater} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 40 },
  title: { color: "white", fontSize: 28, fontWeight: "bold", textAlign: "center", marginTop: 16 },
  subtitle: { color: "#9CA3AF", fontSize: 14, textAlign: "center", marginBottom: 16 },
  summaryBox: { backgroundColor: "#1F2937", borderRadius: 12, padding: 16, marginBottom: 16 },
  summaryTitle: { color: "white", fontSize: 20, textAlign: "center", marginBottom: 8 },
  calories: { color: "white", fontSize: 36, fontWeight: "bold", textAlign: "center" },
  macroRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, borderTopWidth: 1, borderColor: "#374151", paddingTop: 16 },
  macroItem: { alignItems: "center" },
  macroValue: { fontSize: 22, fontWeight: "600" },
  macroLabel: { fontSize: 10, color: "#9CA3AF" },
  waterBox: { marginTop: 16, borderTopWidth: 1, borderColor: "#374151", paddingTop: 16 },
  waterValue: { color: "#22D3EE", fontSize: 22, textAlign: "center" },
  waterLabel: { fontSize: 10, color: "#9CA3AF", textAlign: "center" },
});
