import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Plus, X } from "lucide-react-native";

interface WaterEntry {
  id: string;
  amount: number;
}

interface WaterSectionProps {
  entries: WaterEntry[];
  onAddWater: () => void;
  onDeleteWater: (id: string) => void;
}

export function WaterSection({ entries, onAddWater, onDeleteWater }: WaterSectionProps) {
  const totalWater = entries.reduce((sum, entry) => sum + entry.amount, 0);

  const formatAmount = (amount: number) =>
    amount >= 1000 ? `${(amount / 1000).toFixed(2)} л` : `${amount} мл`;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💧 Вода</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddWater}>
          <Plus color="#fff" size={16} style={{ marginRight: 4 }} />
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>

      {/* Total Water */}
      {totalWater > 0 && (
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>{formatAmount(totalWater)}</Text>
        </View>
      )}

      {/* Entries */}
      {entries.length > 0 && (
        <ScrollView style={styles.entriesContainer}>
          {entries.map((entry) => (
            <View key={entry.id} style={styles.entry}>
              <Text style={styles.entryText}>{formatAmount(entry.amount)}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteWater(entry.id)}
              >
                <X color="#9CA3AF" size={16} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: '600',

  },
  totalBox: {
    marginTop: 4,
  },
  totalText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  entriesContainer: {
    marginTop: 8,
  },
  entry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#374151",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  entryText: {
    color: "#fff",
    fontSize: 14,
  },
  deleteButton: {
    padding: 4,
  },
});
