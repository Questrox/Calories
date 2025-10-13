import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import MealSection from './components/meal-section';
import { WaterSection } from './components/water-section';
import { AddFoodDialog } from './components/add-food-dialog';
import { AddWaterDialog } from './components/add-water-dialog';
import { MealPlans } from './components/meal-plans';
import { MealPlanDetail } from './components/meal-plan-detail';
import { Profile } from './components/profile';
import DatePickerSimple from './components/date-picker';
import { FoodItem } from './components/food-item';
import { MealPlanDetails } from './components/meal-plans-data';

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface WaterEntry {
  id: string;
  amount: number;
}

interface MealData {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<MealData>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [waterDialogOpen, setWaterDialogOpen] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<MealType | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MealPlanDetails | null>(null);
  const [activeDiet, setActiveDiet] = useState<MealPlanDetails | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingDiet, setPendingDiet] = useState<MealPlanDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'diary' | 'plans' | 'profile'>('diary');

  const allFoods = Object.values(meals).flat();
  const totalCalories = allFoods.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = allFoods.reduce((sum, item) => sum + item.protein, 0);
  const totalFat = allFoods.reduce((sum, item) => sum + item.fat, 0);
  const totalCarbs = allFoods.reduce((sum, item) => sum + item.carbs, 0);
  const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const getMealTitle = (meal: MealType) => {
    switch (meal) {
      case 'breakfast': return 'Завтрак';
      case 'lunch': return 'Обед';
      case 'dinner': return 'Ужин';
    }
  };

  const handleAddFood = (mealType: MealType) => {
    setCurrentMeal(mealType);
    setDialogOpen(true);
  };

  const handleFoodAdded = (foodData: Omit<FoodItem, 'id'>) => {
    if (!currentMeal) return;
    const newFood: FoodItem = { ...foodData, id: Date.now().toString() };
    setMeals(prev => ({
      ...prev,
      [currentMeal]: [...prev[currentMeal], newFood],
    }));
  };

  const handleDeleteFood = (mealType: MealType, foodId: string) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(item => item.id !== foodId),
    }));
  };

  const handleAddWater = (amount: number) => {
    setWaterEntries(prev => [...prev, { id: Date.now().toString(), amount }]);
  };

  const handleDeleteWater = (id: string) => {
    setWaterEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleActivateDiet = (diet: MealPlanDetails) => {
    if (activeDiet && activeDiet.id !== diet.id) {
      setPendingDiet(diet);
      setConfirmVisible(true);
    } else {
      setActiveDiet(diet);
    }
  };

  const handleConfirmDietChange = () => {
    if (pendingDiet) {
      setActiveDiet(pendingDiet);
      setPendingDiet(null);
    }
    setConfirmVisible(false);
  };

  const handleCancelDietChange = () => {
    setPendingDiet(null);
    setConfirmVisible(false);
  };

  const handleViewDietFromProfile = (diet: MealPlanDetails) => {
    setSelectedPlan(diet);
    setActiveTab('plans');
  };

  return (
    <SafeAreaView style={styles.container}>
      {activeTab === 'diary' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Дневник питания</Text>
          <Text style={styles.subtitle}>Отслеживайте свое питание каждый день</Text>

          <DatePickerSimple date={selectedDate} onChange={setSelectedDate} />

          {/* Daily summary */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Употреблено за день</Text>
            <Text style={styles.calories}>{totalCalories} ккал</Text>
            {totalCalories > 0 && (
              <View style={styles.macroRow}>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: '#60A5FA' }]}>{totalProtein}</Text>
                  <Text style={styles.macroLabel}>Белки (г)</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: '#FB923C' }]}>{totalFat}</Text>
                  <Text style={styles.macroLabel}>Жиры (г)</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={[styles.macroValue, { color: '#34D399' }]}>{totalCarbs}</Text>
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

          {/* Meal sections */}
          <MealSection
            title="🌅 Завтрак"
            items={meals.breakfast}
            onAdd={() => handleAddFood('breakfast')}
            onDelete={id => handleDeleteFood('breakfast', id)}
            showCalories
          />
          <MealSection
            title="☀️ Обед"
            items={meals.lunch}
            onAdd={() => handleAddFood('lunch')}
            onDelete={id => handleDeleteFood('lunch', id)}
            showCalories
          />
          <MealSection
            title="🌙 Ужин"
            items={meals.dinner}
            onAdd={() => handleAddFood('dinner')}
            onDelete={id => handleDeleteFood('dinner', id)}
            showCalories
          />

          <WaterSection entries={waterEntries} onAddWater={() => setWaterDialogOpen(true)} onDeleteWater={handleDeleteWater} />

          {/* Dialogs */}
          <AddFoodDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onAddFood={handleFoodAdded}
            mealTitle={currentMeal ? getMealTitle(currentMeal) : 'Приём пищи'}
          />
          <AddWaterDialog open={waterDialogOpen} onClose={() => setWaterDialogOpen(false)} onAdd={handleAddWater} />
        </ScrollView>
      )}

      {activeTab === 'plans' && (
        selectedPlan ? (
          <MealPlanDetail
            plan={selectedPlan}
            onBack={() => setSelectedPlan(null)}
            onActivate={handleActivateDiet}
            isActive={activeDiet?.id === selectedPlan.id}
          />
        ) : (
          <MealPlans onPlanSelect={setSelectedPlan} />
        )
      )}

      {activeTab === 'profile' && <Profile activeDiet={activeDiet} onViewDiet={handleViewDietFromProfile} />}

      {/* Confirm Diet Change Modal */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Изменить активную диету?</Text>
            <Text style={styles.modalText}>
              У вас уже активна диета "{activeDiet?.title}". Заменить её на "{pendingDiet?.title}"?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalBtn, styles.cancelBtn]} onPress={handleCancelDietChange}>
                <Text style={styles.modalBtnText}>Отмена</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.confirmBtn]} onPress={handleConfirmDietChange}>
                <Text style={styles.modalBtnText}>Изменить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tabs */}
            <View style={styles.tabBar}>
              {['diary', 'plans', 'profile'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab as any)}
                  style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                >
                  <Text style={styles.tabText}>
                    {tab === 'diary' ? 'Дневник' : tab === 'plans' ? 'Планы' : 'Профиль'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1F2937' },
  tabButton: { flex: 1, padding: 16 },
  tabButtonActive: { backgroundColor: '#374151' },
  tabText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  title: { color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 16 },
  subtitle: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  summaryBox: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16, marginBottom: 16 },
  summaryTitle: { color: 'white', fontSize: 20, textAlign: 'center', marginBottom: 8 },
  calories: { color: 'white', fontSize: 36, fontWeight: 'bold', textAlign: 'center' },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, borderTopWidth: 1, borderColor: '#374151', paddingTop: 16 },
  macroItem: { alignItems: 'center' },
  macroValue: { fontSize: 22, fontWeight: '600' },
  macroLabel: { fontSize: 10, color: '#9CA3AF' },
  waterBox: { marginTop: 16, borderTopWidth: 1, borderColor: '#374151', paddingTop: 16 },
  waterValue: { color: '#22D3EE', fontSize: 22, textAlign: 'center' },
  waterLabel: { fontSize: 10, color: '#9CA3AF', textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#1F2937', borderRadius: 12, padding: 20, width: '80%' },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  modalText: { color: '#9CA3AF', fontSize: 14, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#374151' },
  confirmBtn: { backgroundColor: '#2563EB' },
  modalBtnText: { color: 'white', fontWeight: 'bold' },
});
