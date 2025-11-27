import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Plus, X } from "lucide-react-native";
import { WaterEntry } from "../../entities/food";
import { WaterEntryDTO } from "../../shared/api/g";

interface WaterSectionProps {
  entries: WaterEntryDTO[];
  onAddWater: () => void;
  onDeleteWater: (id: number) => void;
}

export function WaterSection({ entries, onAddWater, onDeleteWater }: WaterSectionProps) {
  const totalWater = entries.reduce((sum, entry) => sum + entry.amount!, 0);

  const formatAmount = (amount: number) =>
    amount >= 1000 ? `${(amount / 1000).toFixed(2)} л` : `${amount} мл`;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💧 Вода</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddWater}>
          <Plus color="#fff" size={16} />
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>

      {/* Total Water */}
      {totalWater > 0 && (
        <View style={styles.caloriesBox}>
          <Text style={styles.caloriesText}>{formatAmount(totalWater)}</Text>
        </View>
      )}

      {/* Entries */}
      {entries.length > 0 && (
        <FlatList
          data={entries}
          keyExtractor={(entry) => entry.id!.toString()}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <Text style={styles.entryText}>{formatAmount(item.amount!)}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteWater(item.id!)}>
                <X color="#9CA3AF" size={16} />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.itemsContainer}
        />
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
  itemsContainer: {
    marginTop: 8,
  },
  entry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  entryText: {
    color: '#E5E7EB',
    fontSize: 13,
  },
  deleteButton: {
    padding: 4,
  },
});
