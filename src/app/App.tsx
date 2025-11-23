import React, { useState, useEffect } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LoginPage } from "../pages/LoginPage";
import { DiaryPage } from "../pages/DiaryPage";
import { PlansPage } from "../pages/PlansPage";
import { ProfilePage } from "../pages/ProfilePage";
import { MealData, WaterEntry } from "../entities/food";
import { MealPlanDetails } from "../entities/plans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authFetch } from "../shared/api/authFetch";
import { ApiClient } from "../shared/api/g";

export default function App() {
  const [activeTab, setActiveTab] = useState<"diary" | "plans" | "profile">("diary");
  const [meals, setMeals] = useState<MealData>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [activeDiet, setActiveDiet] = useState<MealPlanDetails | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<MealPlanDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiClient = new ApiClient("http://10.0.2.2:5139", { fetch: authFetch });
  // проверка токена при старте приложения
    useEffect(() => {
        async function checkToken() {
          try {
            const token = await AsyncStorage.getItem("jwt");
            if (!token) {
              setIsAuthenticated(false);
              return;
            }

            // проверяем валидность токена через ApiClient
            await apiClient.validate();
            setIsAuthenticated(true);
          } catch {
            setIsAuthenticated(false);
            await AsyncStorage.removeItem("jwt");
          } finally {
            setLoading(false);
          }
        }

        checkToken();
      }, []);

    if (loading) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#fff" />
        </SafeAreaView>
      );
    }

    if (!isAuthenticated) {
        return (
          <LoginPage
            apiClient={apiClient}
            onLoginSuccess={() => setIsAuthenticated(true)}
          />
        );
    }

  function handleViewDiet(diet: MealPlanDetails) {
    setSelectedPlan(diet);
    setActiveTab("plans");
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
          />
        )}

        {activeTab === "plans" && (
          <PlansPage
            activeDiet={activeDiet}
            setActiveDiet={setActiveDiet}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />
        )}

        {activeTab === "profile" && (
          <ProfilePage
            activeDiet={activeDiet}
            setActiveDiet={setActiveDiet}
            onViewDiet={handleViewDiet}
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
