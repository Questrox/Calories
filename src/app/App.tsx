import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LoginPage } from "../pages/LoginPage";
import { DiaryPage } from "../pages/DiaryPage";
import { PlansPage } from "../pages/PlansPage";
import { ProfilePage } from "../pages/ProfilePage";
import { MealData, WaterEntry } from "../entities/food";
import { MealPlanDetails } from "../entities/plans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiClient, FoodDTO, MealPlanDTO, WaterEntryDTO, FoodEntryDTO, authFetch } from "../shared/api";
import { BASE_URL } from "../../config.local.js";

export default function App() {
  const [activeTab, setActiveTab] = useState<"diary" | "plans" | "profile">("diary");
  const [meals, setMeals] = useState<MealData>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [waterEntries, setWaterEntries] = useState<WaterEntryDTO[]>([]);
  const [activeDiet, setActiveDiet] = useState<MealPlanDTO | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MealPlanDTO | null>(null);
  const [foods, setFoods] = useState<FoodDTO[]>([]);
  const [plans, setPlans] = useState<MealPlanDTO[]>([]);

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiClient = new ApiClient(BASE_URL, { fetch: authFetch });


  async function initialize() {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("jwt");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // проверяем валидность токена через ApiClient
      await apiClient.validate();
      setIsAuthenticated(true);

      // загружаем данные
      const foodData = await apiClient.getFoods();
      setFoods(foodData);

      const plansData = await apiClient.getMealPlans();
      setPlans(plansData);

      const dietData = await apiClient.getCurrentMealPlan();
      setActiveDiet(dietData);

      const currDate = new Date();
      const waterData = await apiClient.getWaterEntries(currDate);
      setWaterEntries(waterData);

      const foodEntriesData = await apiClient.getFoodEntries(currDate);
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
    } catch {
      setIsAuthenticated(false);
      await AsyncStorage.removeItem("jwt");
    } finally {
      setLoading(false);
    }
  }

  // проверка токена при старте приложения
    useEffect(() => {
        initialize();
      }, []);

    if (loading) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center",
            alignItems: "center", backgroundColor: "black" }}>
          <ActivityIndicator size="large" color="#fff" />
        </SafeAreaView>
      );
    }

    if (!isAuthenticated) {
        return (
          <LoginPage
            apiClient={apiClient}
            onLoginSuccess={initialize}
          />
        );
    }

  function handleViewDiet(diet: MealPlanDTO) {
    setSelectedPlan(diet);
    setActiveTab("plans");
  }

  async function handleLogout() {
      try {
          setIsAuthenticated(false);
          await AsyncStorage.removeItem("jwt");
          await apiClient.logout();
          setActiveTab("diary");
      } catch (error) { console.error(); }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {activeTab === "diary" && (
          <DiaryPage
            meals={meals}
            setMeals={setMeals}
            waterEntries={waterEntries}
            setWaterEntries={setWaterEntries}
            foods = {foods}
            setFoods = {setFoods}
          />
        )}

        {activeTab === "plans" && (
          <PlansPage
            activeDiet={activeDiet}
            setActiveDiet={setActiveDiet}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            plans={plans}
          />
        )}

        {activeTab === "profile" && (
          <ProfilePage
            activeDiet={activeDiet}
            onViewDiet={handleViewDiet}
            onLogout={handleLogout}
          />
        )}
      </View>

      <View style={styles.tabBar}>
        {["diary", "plans", "profile"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
          >
            <Text style={styles.tabText}>
              {tab === "diary" ? "Дневник" : tab === "plans" ? "Планы" : "Профиль"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  tabBar: { flexDirection: "row", backgroundColor: "#1F2937" },
  tabButton: { flex: 1, padding: 16 },
  tabButtonActive: { backgroundColor: "#374151" },
  tabText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
