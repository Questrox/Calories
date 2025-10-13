import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MealPlanDetails } from "./meal-plans-data";
import { ChevronRight } from "lucide-react-native";


interface ProfileProps {
  activeDiet: MealPlanDetails | null;
  onViewDiet: (diet: MealPlanDetails) => void;
}

export function Profile({ activeDiet, onViewDiet }: ProfileProps) {
  const today = new Date().getDay();
  const dayOfWeek = today === 0 ? 7 : today;
  const todayMenu = activeDiet?.weekMenu.find((menu) => menu.day === dayOfWeek);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
        <Text style={styles.subtitle}>Ваш план питания и настройки</Text>
      </View>

      {activeDiet ? (
        <>
          {/* Active Diet Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Активная диета</Text>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => onViewDiet(activeDiet)}
              activeOpacity={0.8}
            >
              <View style={styles.cardButtonContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dietTitle}>{activeDiet.title}</Text>
                  <Text style={styles.dietDescription}>{activeDiet.description}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Today's Menu */}
          {todayMenu && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Меню на сегодня</Text>
              <Text style={styles.dayNumber}>День {dayOfWeek}</Text>

              <View style={styles.mealBox}>
                <Text style={[styles.mealLabel, { color: "#22D3EE" }]}>🌅 Завтрак</Text>
                <Text style={styles.mealText}>{todayMenu.breakfast}</Text>
              </View>

              <View style={styles.mealBox}>
                <Text style={[styles.mealLabel, { color: "#FACC15" }]}>☀️ Обед</Text>
                <Text style={styles.mealText}>{todayMenu.lunch}</Text>
              </View>

              <View style={styles.mealBox}>
                <Text style={[styles.mealLabel, { color: "#A78BFA" }]}>🌙 Ужин</Text>
                <Text style={styles.mealText}>{todayMenu.dinner}</Text>
              </View>

              {todayMenu.snacks && (
                <View style={styles.mealBox}>
                  <Text style={[styles.mealLabel, { color: "#4ADE80" }]}>🍎 Перекусы</Text>
                  <Text style={styles.mealText}>{todayMenu.snacks}</Text>
                </View>
              )}
            </View>
          )}

          {/* Macros Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Целевые показатели</Text>
            <View style={styles.macrosGrid}>
              <View style={styles.macroBox}>
                <Text style={styles.macroLabel}>Калории</Text>
                <Text style={styles.macroValue}>{activeDiet.macros.calories}</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={styles.macroLabel}>Белки</Text>
                <Text style={styles.macroValue}>{activeDiet.macros.protein}</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={styles.macroLabel}>Жиры</Text>
                <Text style={styles.macroValue}>{activeDiet.macros.fat}</Text>
              </View>
              <View style={styles.macroBox}>
                <Text style={styles.macroLabel}>Углеводы</Text>
                <Text style={styles.macroValue}>{activeDiet.macros.carbs}</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.card}>
          <View style={styles.noDietBox}>
            <Text style={styles.noDietText}>У вас пока нет активной диеты</Text>
            <Text style={styles.noDietHint}>
              Перейдите во вкладку "Планы питания" и выберите подходящий план
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#000",
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  dayNumber: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  cardButton: {
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 12,
  },
  cardButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dietTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  dietDescription: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  mealBox: {
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  mealLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  mealText: {
    color: "#E5E7EB",
    fontSize: 13,
  },
  macrosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
  },
  macroBox: {
    width: "48%",
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  macroValue: {
    color: "#fff",
    fontSize: 14,
  },
  noDietBox: {
    alignItems: "center",
    paddingVertical: 12,
  },
  noDietText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 6,
  },
  noDietHint: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
  },
});
