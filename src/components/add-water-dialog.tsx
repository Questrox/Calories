import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface AddWaterDialogProps {
  open: boolean;
  onClose: () => void; // функция закрытия
  onAdd: (amount: number) => void;
}

export function AddWaterDialog({ open, onClose, onAdd }: AddWaterDialogProps) {
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const num = parseInt(amount);
    if (num > 0) {
      onAdd(num);
      setAmount("");
      onClose();
    }
  };

  const handleCancel = () => {
    setAmount("");
    onClose();
  };

  const presetAmounts = [250, 500, 1000];

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <KeyboardAvoidingView
          style={styles.dialogWrapper}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity activeOpacity={1} style={styles.dialog}>
            <Text style={styles.title}>Добавить воду</Text>

            <View style={styles.inputBox}>
              <Text style={styles.label}>Количество (мл)</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="250"
                keyboardType="numeric"
                style={styles.input}
                autoFocus
              />
            </View>

            <View style={styles.presetsRow}>
              {presetAmounts.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={styles.presetBtn}
                  onPress={() => setAmount(val.toString())}
                >
                  <Text style={styles.presetBtnText}>
                    {val >= 1000 ? `${val / 1000} л` : `${val} мл`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.addBtn,
                (!amount || parseInt(amount) <= 0) && styles.addBtnDisabled,
              ]}
              onPress={handleAdd}
              disabled={!amount || parseInt(amount) <= 0}
            >
              <Text style={styles.addBtnText}>Добавить</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Отмена</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogWrapper: {
    width: "90%",
  },
  dialog: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  inputBox: {
    marginBottom: 16,
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#374151",
    borderColor: "#4B5563",
    borderWidth: 1,
    borderRadius: 8,
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  presetsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: "#374151",
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  presetBtnText: {
    color: "white",
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: "#4B5563",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  addBtnDisabled: {
    backgroundColor: "#6B7280",
  },
  addBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
