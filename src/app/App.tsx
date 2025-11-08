import React, { useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { DiaryPage } from "../pages/DiaryPage";
import { PlansPage } from "../pages/PlansPage";
import { ProfilePage } from "../pages/ProfilePage";
import { MealData, WaterEntry } from "../entities/food";
import { MealPlanDetails } from "../entities/plans";


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
