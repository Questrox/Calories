import React, { useState } from "react";
import { View, Modal, Text, Pressable, StyleSheet } from "react-native";
import { MealPlans } from "../features/plans/meal-plans";
import { MealPlanDetails } from "../entities/plans";
import { MealPlanDetail } from "../features/plans/meal-plan-detail";
import { MealPlanDTO, ApiClient } from "../shared/api/g";
import { authFetch } from "../shared/api/authFetch";
import { BASE_URL } from "../../config.local.js";

interface PlansPageProps {
  activeDiet: MealPlanDTO | null;
  setActiveDiet: React.Dispatch<React.SetStateAction<MealPlanDTO | null>>;
  selectedPlan: MealPlanDTO | null;
  setSelectedPlan: React.Dispatch<React.SetStateAction<MealPlanDTO | null>>;
  plans: MealPlanDTO[];
}

export function PlansPage({ activeDiet, setActiveDiet, selectedPlan, setSelectedPlan, plans }: PlansPageProps) {
  const [pendingDiet, setPendingDiet] = useState<MealPlanDTO | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const apiClient = new ApiClient(BASE_URL, { fetch: authFetch });

  const handleActivateDiet = async (diet: MealPlanDTO) => {
    if (activeDiet && activeDiet.id !== diet.id) {
      setPendingDiet(diet);
      setConfirmVisible(true);
      return;
    }

    try {
      await apiClient.selectMealPlan(diet.id!);
      setActiveDiet(diet);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDietChange = async () => {
    if (!pendingDiet) {
      setConfirmVisible(false);
      return;
    }

    try {
      await apiClient.selectMealPlan(pendingDiet.id!);
      setActiveDiet(pendingDiet);
    } catch (error) {
      console.error(error);
    } finally {
      setPendingDiet(null);
      setConfirmVisible(false);
    }
  };


  const handleCancelDietChange = () => {
    setPendingDiet(null);
    setConfirmVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {selectedPlan ? (
        <MealPlanDetail
          plan={selectedPlan}
          onBack={() => setSelectedPlan(null)}
          onActivate={handleActivateDiet}
          isActive={activeDiet?.id === selectedPlan.id}
        />
      ) : (
        <MealPlans onPlanSelect={setSelectedPlan} plans={plans} />
      )}

      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Изменить активную диету?</Text>
            <Text style={styles.modalText}>
              У вас уже активна диета "{activeDiet?.title}". Заменить её на "{pendingDiet?.title}"?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalBtn, styles.cancelBtn]} onPress={handleCancelDietChange}>
                <Text style={styles.modalBtnText}>Отмена</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.confirmBtn]} onPress={handleConfirmDietChange}>
                <Text style={styles.modalBtnText}>Изменить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)" },
  modalContent: { backgroundColor: "#1F2937", borderRadius: 12, padding: 20, width: "80%" },
  modalTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalText: { color: "#9CA3AF", fontSize: 14, marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalBtn: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 8, alignItems: "center" },
  cancelBtn: { backgroundColor: "#374151" },
  confirmBtn: { backgroundColor: "#2563EB" },
  modalBtnText: { color: "white", fontWeight: "bold" },
});
