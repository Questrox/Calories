import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const Tabs = ({ children }: any) => <View>{children}</View>;
export const TabsList = ({ children }: any) => <View style={styles.list}>{children}</View>;
export const TabsTrigger = ({ children, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.trigger}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);
export const TabsContent = ({ children }: any) => <View style={styles.content}>{children}</View>;

const styles = StyleSheet.create({
  list: { flexDirection: 'row', backgroundColor: '#1f2937', borderRadius: 8 },
  trigger: { flex: 1, padding: 12 },
  text: { color: 'white', textAlign: 'center' },
  content: { marginTop: 16 },
});
