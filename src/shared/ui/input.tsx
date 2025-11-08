import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const Input = (props: any) => (
  <TextInput
    {...props}
    style={[styles.input, props.style]}
    placeholderTextColor="#9ca3af"
  />
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#111827',
    color: 'white',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
});
