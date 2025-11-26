import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MealPlanDetails } from '../../entities/plans';
import { MealPlanDTO, MealPlanDayDTO } from '../../shared/api/g';

interface MealPlanDetailProps {
  plan: MealPlanDTO;
  onBack: () => void;
  onActivate: (plan: MealPlanDTO) => void;
  isActive: boolean;
}

export function MealPlanDetail({ plan, onBack, onActivate, isActive }: MealPlanDetailProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{plan.title}</Text>
      </View>

      {/* Activate button */}
      {isActive ? (
        <View style={styles.activeRow}>
          <Text style={styles.check}>✔</Text>
          <Text style={styles.activeText}>Активна</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.activateBtn} onPress={() => onActivate(plan)}>
          <Text style={styles.activateText}>Активировать</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📖 Описание</Text>
          <Text style={styles.cardText}>{plan.fullDescription}</Text>
        </View>

        {/* Benefits */}
        {plan.benefits!.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>✅ Преимущества</Text>
            {plan.benefits!.map((b, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{b}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Warnings */}
        {plan.warnings && plan.warnings.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚠️ Важно знать</Text>
            {plan.warnings.map((w, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.warningBullet}>•</Text>
                <Text style={styles.listText}>{w}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Macros */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Макронутриенты</Text>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Калории</Text>
              <Text style={styles.macroValue}>{plan.calories}</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Белки</Text>
              <Text style={styles.macroValue}>{plan.protein}</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Жиры</Text>
              <Text style={styles.macroValue}>{plan.fat}</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Углеводы</Text>
              <Text style={styles.macroValue}>{plan.carbs}</Text>
            </View>
          </View>
        </View>

        {/* Weekly Menu */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Меню на неделю</Text>
          {plan.mealPlanDay!.map(day => (
            <View key={day.day} style={styles.dayCard}>
              <Text style={styles.dayTitle}>День {day.day}</Text>

              <View style={styles.mealItem}>
                <Text style={[styles.mealLabel, { color: '#22D3EE' }]}>🌅 Завтрак</Text>
                <Text style={styles.mealText}>{day.breakfast}</Text>
              </View>

              <View style={styles.mealItem}>
                <Text style={[styles.mealLabel, { color: '#FACC15' }]}>☀️ Обед</Text>
                <Text style={styles.mealText}>{day.lunch}</Text>
              </View>

              <View style={styles.mealItem}>
                <Text style={[styles.mealLabel, { color: '#A78BFA' }]}>🌙 Ужин</Text>
                <Text style={styles.mealText}>{day.dinner}</Text>
              </View>

              {day.snacks && (
                <View style={styles.mealItem}>
                  <Text style={[styles.mealLabel, { color: '#34D399' }]}>🍎 Перекусы</Text>
                  <Text style={styles.mealText}>{day.snacks}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'black' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  backButton: { padding: 8, marginRight: 8, backgroundColor: '#1F2937', borderRadius: 8 },
  backArrow: { color: 'white', fontSize: 16 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  activateBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, marginVertical: 8 },
  activateText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  activeRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  check: { color: '#22C55E', fontSize: 18, marginRight: 4 },
  activeText: { color: '#22C55E', fontWeight: 'bold' },
  scrollContent: { paddingBottom: 32 },
  card: { backgroundColor: '#1F2937', borderRadius: 12, padding: 12, marginBottom: 16 },
  cardTitle: { fontSize: 16, color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#D1D5DB', lineHeight: 20 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  bullet: { color: '#22C55E', marginRight: 4 },
  warningBullet: { color: '#FACC15', marginRight: 4 },
  listText: { color: '#D1D5DB', fontSize: 14, flexShrink: 1 },
  macroRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  macroItem: { backgroundColor: '#374151', padding: 8, borderRadius: 8, width: '48%', marginBottom: 8, alignItems: 'center' },
  macroLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  macroValue: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  dayCard: { backgroundColor: '#374151', borderRadius: 12, padding: 12, marginBottom: 12 },
  dayTitle: { color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  mealItem: { backgroundColor: '#4B5563', padding: 8, borderRadius: 8, marginBottom: 6 },
  mealLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  mealText: { fontSize: 14, color: '#E5E7EB' },
});
