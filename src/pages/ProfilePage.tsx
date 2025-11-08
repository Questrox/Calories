import React, { useState } from "react";
import { View } from "react-native";
import { Profile } from "../features/profile/profile";
import { MealPlanDetails } from "../entities/plans";

interface ProfilePageProps {
  activeDiet: MealPlanDetails | null;
  setActiveDiet: React.Dispatch<React.SetStateAction<MealPlanDetails | null>>;
  onViewDiet: (diet: MealPlanDetails) => void;
}

export function ProfilePage({ activeDiet, setActiveDiet, onViewDiet }: ProfilePageProps) {

  return (
    <View style={{ flex: 1 }}>
      <Profile activeDiet={activeDiet} onViewDiet={onViewDiet} />
    </View>
  );
};
