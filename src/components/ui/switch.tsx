import React from 'react';
import { Switch } from 'react-native';

export const Switcher = ({ value, onValueChange }: any) => (
  <Switch value={value} onValueChange={onValueChange} />
);
