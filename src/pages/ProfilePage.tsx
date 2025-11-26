import React, { useState } from "react";
import { View } from "react-native";
import { Profile } from "../features/profile/profile";
import { MealPlanDetails } from "../entities/plans";
import { MealPlanDTO } from "../shared/api/g";

interface ProfilePageProps {
  activeDiet: MealPlanDTO | null;
  onViewDiet: (diet: MealPlanDTO) => void;
}

export function ProfilePage({ activeDiet,  onViewDiet }: ProfilePageProps) {

  return (
    <View style={{ flex: 1 }}>
      <Profile activeDiet={activeDiet} onViewDiet={onViewDiet} />
    </View>
  );
};
