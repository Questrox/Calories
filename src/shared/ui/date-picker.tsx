import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DatePickerSimple({ date, onChange }: any) {
  const prev = async () => { const d = new Date(date); d.setDate(d.getDate() - 1); await onChange(d); };
  const next = async () => { const d = new Date(date); d.setDate(d.getDate() + 1); await onChange(d); };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={prev} style={styles.button}>
        <Text style={styles.buttonText}>&lt;</Text>
      </TouchableOpacity>
      <Text style={styles.dateText}>
        {`${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`}
      </Text>
      <TouchableOpacity onPress={next} style={styles.button}>
        <Text style={styles.buttonText}>&gt;</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  button: { paddingVertical: 4, paddingHorizontal: 12, backgroundColor: '#374151', borderRadius: 8 },
  buttonText: { color: '#FFFFFF' },
  dateText: { color: '#FFFFFF' },
});
