import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MealPlanDetails } from '../../entities/plans';
import { MealPlanDTO } from '../../shared/api/g';

interface MealPlansProps {
  onPlanSelect: (plan: MealPlanDTO) => void;
  plans: MealPlanDTO[];
}

export function MealPlans({ onPlanSelect, plans }: MealPlansProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Планы питания</Text>
        <Text style={styles.subtitle}>Выберите план, который соответствует вашим целям</Text>
      </View>

      {plans.map((plan) => (
        <TouchableOpacity key={plan.id} style={styles.card} onPress={() => onPlanSelect(plan)}>
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>
              <View style={styles.macrosRow}>
                <Text style={styles.macroText}>{plan.calories}</Text>
                <Text style={styles.macroText}>Б: {plan.protein}</Text>
                <Text style={styles.macroText}>Ж: {plan.fat}</Text>
                <Text style={styles.macroText}>У: {plan.carbs}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#000' },
  header: { marginBottom: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#aaa', textAlign: 'center', marginTop: 4, fontSize: 13 },
  card: { backgroundColor: '#1f2937', borderRadius: 10, padding: 12, marginBottom: 10 },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planTitle: { color: '#fff', fontSize: 18, fontWeight: '500' },
  planDescription: { color: '#bbb', fontSize: 13, marginTop: 4 },
  macrosRow: { flexDirection: 'row', marginTop: 8, gap: 8 },
  macroText: { color: '#888', fontSize: 12 },
  arrow: { color: '#666', fontSize: 22, marginLeft: 6 },
});
