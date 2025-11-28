import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Profile } from "../features/profile/profile";
import { MealPlanDetails } from "../entities/plans";
import { MealPlanDTO } from "../shared/api/g";

interface ProfilePageProps {
  activeDiet: MealPlanDTO | null;
  onViewDiet: (diet: MealPlanDTO) => void;
  onLogout: () => void;
}

export function ProfilePage({ activeDiet, onViewDiet, onLogout }: ProfilePageProps) {

  return (
    <View style={{ flex: 1 }}>
      <Profile activeDiet={activeDiet} onViewDiet={onViewDiet} onLogout={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
    logoutContainer: {
      marginTop: 24,
      alignItems: "center",
    },
    logoutButton: {
      backgroundColor: "#EF4444",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    logoutText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },

});