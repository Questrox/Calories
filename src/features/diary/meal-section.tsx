import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { FoodItem } from "../../entities/food";
import { FoodItemComponent } from './food-item';
import { Plus } from 'lucide-react-native';
import { FoodEntryDTO } from "../../shared/api/g";

interface MealSectionProps {
  title: string;
  items: FoodEntryDTO[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  showCalories?: boolean;
}

export default function MealSection({ title, items, onAdd, onDelete, showCalories = true }: MealSectionProps) {
<<<<<<< HEAD
  const totalCalories = items.reduce((sum, item) => sum + item.food!.calories! * item.weight! / 100, 0);
  const totalProtein = items.reduce((sum, item) => sum + item.food!.protein! * item.weight! / 100, 0);
  const totalFat = items.reduce((sum, item) => sum + item.food!.fat! * item.weight! / 100, 0);
  const totalCarbs = items.reduce((sum, item) => sum + item.food!.carbs! * item.weight! / 100, 0);
=======
  const totalCalories = items.reduce((sum, item) => sum + item.food!.calories! * item.weight / 100, 0);
  const totalProtein = items.reduce((sum, item) => sum + item.food!.protein! * item.weight / 100, 0);
  const totalFat = items.reduce((sum, item) => sum + item.food!.fat! * item.weight / 100, 0);
  const totalCarbs = items.reduce((sum, item) => sum + item.food!.carbs! * item.weight / 100, 0);
>>>>>>> 17e4651 (Распознавание еды по фото, исправления в расчете калорий, исправил ошибку с VirtualizedLists)

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Plus width={16} height={16} color="white" />
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>

      {/* Calories summary */}
      {showCalories && totalCalories > 0 && (
        <View style={styles.caloriesBox}>
          <Text style={styles.caloriesText}>{totalCalories.toFixed(2)} ккал</Text>
          <View style={styles.macroRow}>
            <Text style={[styles.macroText, { marginRight: 16 }]}>Б: {totalProtein.toFixed(2)}г</Text>
            <Text style={[styles.macroText, { marginRight: 16 }]}>Ж: {totalFat.toFixed(2)}г</Text>
            <Text style={styles.macroText}>У: {totalCarbs.toFixed(2)}г</Text>
          </View>
        </View>
      )}

      {/* Food items */}
      {items.length > 0 && (
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <FoodItemComponent
              key={item.id!.toString()}
              item={item}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  caloriesBox: {
    marginTop: 4,
  },
  caloriesText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  macroText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  itemsContainer: {
    marginTop: 8,
  },
});
