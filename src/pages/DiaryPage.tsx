import React, { useState } from "react";
import { ScrollView, View, Text, Modal, Pressable, StyleSheet } from "react-native";
import MealSection from "../features/diary/meal-section";
import { WaterSection } from "../features/diary/water-section";
import { AddFoodDialog } from "../features/diary/add-food-dialog";
import { AddWaterDialog } from "../features/diary/add-water-dialog";
import DatePickerSimple from "../shared/ui/date-picker";
import { FoodItem, MealData, WaterEntry } from "../entities/food";
import { ApiClient, FoodDTO, WaterEntryDTO, CreateWaterEntryDTO, FoodEntryDTO, CreateFoodEntryDTO } from "../shared/api/g";
import { authFetch } from "../shared/api/authFetch";
import { BASE_URL } from "../../config.local.js";

type MealType = "breakfast" | "lunch" | "dinner";

interface DiaryPageProps {
  meals: MealData;
  setMeals: React.Dispatch<React.SetStateAction<MealData>>;
  waterEntries: WaterEntryDTO[];
  setWaterEntries: React.Dispatch<React.SetStateAction<WaterEntryDTO[]>>;
  foods: FoodDTO[];
  setFoods : React.Dispatch<React.SetStateAction<FoodDTO[]>>;
}

export function DiaryPage({ meals, setMeals, waterEntries, setWaterEntries, foods, setFoods }: DiaryPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [waterDialogOpen, setWaterDialogOpen] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<MealType | null>(null);

  const allFoods = Object.values(meals).flat();
  const totalCalories = allFoods.reduce((sum, item) => sum + item.food.calories * item.weight / 100, 0);
  const totalProtein = allFoods.reduce((sum, item) => sum + item.food.protein * item.weight / 100, 0);
  const totalFat = allFoods.reduce((sum, item) => sum + item.food.fat * item.weight / 100, 0);
  const totalCarbs = allFoods.reduce((sum, item) => sum + item.food.carbs * item.weight / 100, 0);
  const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount!, 0);

  const apiClient = new ApiClient(BASE_URL, { fetch: authFetch });

  const handleDateChange = async (newDate: Date) => {
    try {
        setSelectedDate(newDate);
        const foodEntriesData = await apiClient.getFoodEntries(newDate);
        const sortedMeals: MealData = {
          breakfast: [],
          lunch: [],
          dinner: [],
        };

        for (const entry of foodEntriesData) {
          const type = entry.mealType?.name;

          if (type === "breakfast") sortedMeals.breakfast.push(entry);
          else if (type === "lunch") sortedMeals.lunch.push(entry);
          else if (type === "dinner") sortedMeals.dinner.push(entry);
        }
        setMeals(sortedMeals);

        const waterData = await apiClient.getWaterEntries(newDate);
        setWaterEntries(waterData);
    } catch (error) { console.error(error); }
  }

  const getMealTitle = (meal: MealType) => {
    switch (meal) {
      case "breakfast": return "Завтрак";
      case "lunch": return "Обед";
      case "dinner": return "Ужин";
    }
  };

  const getMealTypeId = (meal: MealType) => {
      switch (meal) {
        case "breakfast": return 1;
        case "lunch": return 2;
        case "dinner": return 3;
      }
    };

  const handleAddFoodEntry = (mealType: MealType) => {
    setCurrentMeal(mealType);
    setDialogOpen(true);
  };

  const handleFoodEntryAdded = async (foodData: Omit<CreateFoodEntryDTO, "date" | "mealTypeId">) => {
    if (!currentMeal) return;
    try {
        const createFood = new CreateFoodEntryDTO ({
            ...foodData,
            date: selectedDate,
            mealTypeId: getMealTypeId(currentMeal),
          });
        const newFood = await apiClient.addFoodEntry(createFood);
        setMeals(prev => ({ ...prev, [currentMeal]: [...prev[currentMeal], newFood] }));
    } catch (error) { console.error(error); }
  };

  const handleDeleteFoodEntry = async (mealType: MealType, foodEntryId: number) => {
    try {
        await apiClient.deleteFoodEntry(foodEntryId);
        setMeals(prev => ({ ...prev, [mealType]: prev[mealType].filter(item => item.id !== foodEntryId) }));
    } catch (error) { console.error(error); }
  };

  const handleAddWaterEntry = async (amount: number) => {
    try {
        const createEntry = new CreateWaterEntryDTO({
            amount: amount,
            date: selectedDate,
            })
        const newEntry = await apiClient.addWaterEntry(createEntry);
        setWaterEntries(prev => [...prev, newEntry]);
    } catch (error) { console.error(error); }
  };

  const handleDeleteWaterEntry = async (id: number) => {
    try {
        await apiClient.deleteWaterEntry(id);
        setWaterEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Дневник питания</Text>
      <Text style={styles.subtitle}>Отслеживайте свое питание каждый день</Text>

      <DatePickerSimple date={selectedDate} onChange={handleDateChange} />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Употреблено за день</Text>
        <Text style={styles.calories}>{totalCalories} ккал</Text>

        {totalCalories > 0 && (
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: "#60A5FA" }]}>{totalProtein.toFixed(2)}</Text>
              <Text style={styles.macroLabel}>Белки (г)</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: "#FB923C" }]}>{totalFat.toFixed(2)}</Text>
              <Text style={styles.macroLabel}>Жиры (г)</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={[styles.macroValue, { color: "#34D399" }]}>{totalCarbs.toFixed(2)}</Text>
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

      <MealSection title="🌅 Завтрак" items={meals.breakfast} onAdd={() => handleAddFoodEntry("breakfast")} onDelete={id => handleDeleteFoodEntry("breakfast", id)} showCalories />
      <MealSection title="☀️ Обед" items={meals.lunch} onAdd={() => handleAddFoodEntry("lunch")} onDelete={id => handleDeleteFoodEntry("lunch", id)} showCalories />
      <MealSection title="🌙 Ужин" items={meals.dinner} onAdd={() => handleAddFoodEntry("dinner")} onDelete={id => handleDeleteFoodEntry("dinner", id)} showCalories />

      <WaterSection entries={waterEntries} onAddWater={() => setWaterDialogOpen(true)} onDeleteWater={handleDeleteWaterEntry} />

      <AddFoodDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      onAddFoodEntry={handleFoodEntryAdded}
      mealTitle={currentMeal ? getMealTitle(currentMeal) : "Приём пищи"}
      foods={foods}
      setFoods={setFoods} />
      <AddWaterDialog open={waterDialogOpen} onClose={() => setWaterDialogOpen(false)} onAdd={handleAddWaterEntry} />
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
