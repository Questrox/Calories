import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const AlertDialog = ({ children, open }: any) => (
  <Modal visible={open} transparent animationType="fade">
    <View style={styles.overlay}>{children}</View>
  </Modal>
);

export const AlertDialogContent = ({ children }: any) => (
  <View style={styles.content}>{children}</View>
);
export const AlertDialogHeader = ({ children }: any) => (
  <View style={styles.header}>{children}</View>
);
export const AlertDialogTitle = ({ children }: any) => (
  <Text style={styles.title}>{children}</Text>
);
export const AlertDialogDescription = ({ children }: any) => (
  <Text style={styles.description}>{children}</Text>
);
export const AlertDialogFooter = ({ children }: any) => (
  <View style={styles.footer}>{children}</View>
);
export const AlertDialogCancel = ({ children, onClick }: any) => (
  <TouchableOpacity onPress={onClick} style={styles.cancelBtn}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);
export const AlertDialogAction = ({ children, onClick }: any) => (
  <TouchableOpacity onPress={onClick} style={styles.actionBtn}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: 16 },
  content: { backgroundColor: '#1f2937', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#374151' },
  header: { marginBottom: 8 },
  title: { color: 'white', fontWeight: '600', fontSize: 16 },
  description: { color: '#9ca3af' },
  footer: { marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#4b5563', borderRadius: 6, marginRight: 8 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#2563eb', borderRadius: 6 },
  text: { color: 'white' },
});
