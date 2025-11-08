import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Trash2 } from "lucide-react-native";
import { FoodItem } from "../../entities/food";

interface FoodItemProps {
  item: FoodItem;
  onDelete: (id: string) => void;
}

export function FoodItemComponent({ item, onDelete }: FoodItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.weight}г • {item.calories} ккал
        </Text>
        <View style={styles.macroRow}>
          <Text style={styles.macro}>Б: {item.protein}г</Text>
          <Text style={styles.macro}>Ж: {item.fat}г</Text>
          <Text style={styles.macro}>У: {item.carbs}г</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <Trash2 size={20} color="#F87171" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#374151",
    borderColor: "#4B5563",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  details: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  macroRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  macro: {
    color: "#9CA3AF",
    fontSize: 12,
    marginRight: 12,
  },
  deleteBtn: {
    padding: 4,
  },
});
