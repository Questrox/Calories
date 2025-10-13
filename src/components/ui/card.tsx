import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Card = ({ children }: any) => <View style={styles.card}>{children}</View>;
export const CardHeader = ({ children }: any) => <View>{children}</View>;
export const CardContent = ({ children }: any) => <View>{children}</View>;
export const CardTitle = ({ children }: any) => <Text style={styles.title}>{children}</Text>;

const styles = StyleSheet.create({
  card: { backgroundColor: '#1f2937', borderRadius: 12, padding: 12 },
  title: { color: 'white', fontWeight: '600', fontSize: 16 },
});
