import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FoodItem, FoodProduct } from "../../entities/food";
import { foodDatabase, searchFoods, calculateNutrients } from "./food-database";
import { launchImageLibrary } from "react-native-image-picker";
import { API_TOKEN, MODEL_ID } from "../../../config.local";

async function handleGetImage() {
  const result = await launchImageLibrary({
    mediaType: "photo",
    includeBase64: true,
  });

  if (result.assets && result.assets.length > 0) {
    const imageBase64 = result.assets[0].base64;
    if (imageBase64) {
      recognizeFood(imageBase64);
    }
  }
}


async function recognizeFood(imageBase64: string) {
  try {
    console.log("Отправляю запрос к Hugging Face...");

    const response = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL_ID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `data:image/jpeg;base64,${imageBase64}`,
        options: { wait_for_model: true }
      }),
    });

    console.log("Фото отправлено, HTTP статус:", response.status);
    const text = await response.text();
    console.log("Ответ Hugging Face (raw):", text);

    if (!response.ok) throw new Error(`Inference request failed: ${response.statusText}`);

    const result = JSON.parse(text);
    console.log("Распознанное блюдо:", result);
    return result;
  } catch (err) {
    console.error("Ошибка:", err);
  }
}





interface AddFoodDialogProps {
  open: boolean;
  onClose: () => void;
  onAddFood: (food: Omit<FoodItem, "id">) => void;
  mealTitle: string;
}

export function AddFoodDialog({ open, onClose, onAddFood, mealTitle }: AddFoodDialogProps) {
  const [view, setView] = useState<"search" | "add-weight" | "add-new">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(null);
  const [weight, setWeight] = useState("");

  const [newProductName, setNewProductName] = useState("");
  const [newProductWeight, setNewProductWeight] = useState("");
  const [newProductCalories, setNewProductCalories] = useState("");
  const [newProductProtein, setNewProductProtein] = useState("");
  const [newProductFat, setNewProductFat] = useState("");
  const [newProductCarbs, setNewProductCarbs] = useState("");

  const filteredFoods = useMemo(() => searchFoods(searchQuery), [searchQuery]);

  const handleProductSelect = (product: FoodProduct) => {
    setSelectedProduct(product);
    setView("add-weight");
  };

  const handleAddWithWeight = () => {
    if (!selectedProduct || !weight) return;

    const weightNum = parseInt(weight);
    const nutrients = calculateNutrients(selectedProduct, weightNum);

    onAddFood({
      name: selectedProduct.name,
      weight: weightNum,
      calories: nutrients.calories,
      protein: nutrients.protein,
      fat: nutrients.fat,
      carbs: nutrients.carbs,
    });

    handleClose();
  };

  const handleAddNewProduct = () => {
    if (!newProductName.trim() || !newProductWeight || !newProductCalories ||
        !newProductProtein || !newProductFat || !newProductCarbs) return;

    onAddFood({
      name: newProductName.trim(),
      weight: parseInt(newProductWeight),
      calories: parseInt(newProductCalories),
      protein: parseFloat(newProductProtein),
      fat: parseFloat(newProductFat),
      carbs: parseFloat(newProductCarbs),
    });

    handleClose();
  };

  const handleClose = () => {
    setView("search");
    setSearchQuery("");
    setSelectedProduct(null);
    setWeight("");
    setNewProductName("");
    setNewProductWeight("");
    setNewProductCalories("");
    setNewProductProtein("");
    setNewProductFat("");
    setNewProductCarbs("");
    onClose();
  };

  const previewNutrients = selectedProduct && weight ? calculateNutrients(selectedProduct, parseInt(weight)) : null;

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
          <View style={styles.dialog}>
            {/* Header */}
            <View style={styles.header}>
              {view !== "search" && (
                <TouchableOpacity
                  onPress={() => {
                    if (view === "add-weight") {
                      setView("search");
                      setSelectedProduct(null);
                      setWeight("");
                    } else {
                      setView("search");
                    }
                  }}
                  style={styles.backBtn}
                >
                  <Text style={styles.backBtnText}>←</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.title}>
                {view === "search" && `Добавить в ${mealTitle.toLowerCase()}`}
                {view === "add-weight" && selectedProduct?.name}
                {view === "add-new" && "Новый продукт"}
              </Text>
            </View>

            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 16 }}>
              {view === "search" && (
                <>
                  {/* Search */}
                  <View style={styles.searchBox}>
                    <TextInput
                      placeholder="Поиск продуктов..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      style={styles.input}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  {/* Add new product button */}
                  <TouchableOpacity
                    style={styles.addNewBtn}
                    onPress={() => setView("add-new")}
                  >
                    <Text style={styles.addNewBtnText}>+ Добавить новый продукт</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.addNewBtn, { backgroundColor: "#2563EB" }]}
                    onPress={() => {
                      handleGetImage();
                    }}
                  >
                    <Text style={styles.addNewBtnText}>Определить продукт по фото</Text>
                  </TouchableOpacity>

                  {/* Product list */}
                  {filteredFoods.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productCard}
                      onPress={() => handleProductSelect(product)}
                    >
                      <View>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productCategory}>{product.category}</Text>
                      </View>
                      <View>
                        <Text style={styles.productInfo}>{product.caloriesPer100g} ккал/100г</Text>
                        <Text style={styles.productInfo}>
                          Б:{product.proteinPer100g} Ж:{product.fatPer100g} У:{product.carbsPer100g}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {view === "add-weight" && selectedProduct && (
                <View style={styles.addWeightBox}>
                  <Text style={styles.label}>Вес (г)</Text>
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="100"
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#9CA3AF"
                  />

                  {previewNutrients && (
                    <View style={styles.nutrientsCard}>
                      <Text style={styles.nutrientsTitle}>Пищевая ценность:</Text>
                      <Text style={styles.nutrientsText}>Калории: {previewNutrients.calories} ккал</Text>
                      <Text style={styles.nutrientsText}>Белки: {previewNutrients.protein} г</Text>
                      <Text style={styles.nutrientsText}>Жиры: {previewNutrients.fat} г</Text>
                      <Text style={styles.nutrientsText}>Углеводы: {previewNutrients.carbs} г</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[styles.addBtn, !weight && styles.addBtnDisabled]}
                    onPress={handleAddWithWeight}
                    disabled={!weight}
                  >
                    <Text style={styles.addBtnText}>Добавить</Text>
                  </TouchableOpacity>
                </View>
              )}

              {view === "add-new" && (
                <View style={styles.addNewBox}>
                  <Text style={styles.label}>Название продукта</Text>
                  <TextInput
                    value={newProductName}
                    onChangeText={setNewProductName}
                    placeholder="Например: Домашний салат"
                    style={styles.input}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.label}>Вес (г)</Text>
                  <TextInput
                    value={newProductWeight}
                    onChangeText={setNewProductWeight}
                    placeholder="100"
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.label}>Калории</Text>
                  <TextInput
                    value={newProductCalories}
                    onChangeText={setNewProductCalories}
                    placeholder="200"
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.label}>Белки (г)</Text>
                  <TextInput
                    value={newProductProtein}
                    onChangeText={setNewProductProtein}
                    placeholder="10"
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.label}>Жиры (г)</Text>
                  <TextInput
                    value={newProductFat}
                    onChangeText={setNewProductFat}
                    placeholder="5"
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.label}>Углеводы (г)</Text>
                  <TextInput
                    value={newProductCarbs}
                    onChangeText={setNewProductCarbs}
                    placeholder="15"
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#9CA3AF"
                  />

                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => setView("search")}
                    >
                      <Text style={styles.cancelBtnText}>Отмена</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={handleAddNewProduct}
                    >
                      <Text style={styles.addBtnText}>Добавить</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  dialog: {
    width: "90%",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  backBtn: { padding: 4, marginRight: 8 },
  backBtnText: { color: "white", fontSize: 18 },
  title: { fontSize: 18, fontWeight: "bold", color: "white", flex: 1 },
  searchBox: { marginBottom: 8 },
  input: {
    backgroundColor: "#374151",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
  },
  addNewBtn: {
    backgroundColor: "#374151",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  addNewBtnText: { color: "white", fontWeight: "bold" },
  productCard: {
    backgroundColor: "#374151",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: { color: "white", fontWeight: "500" },
  productCategory: { color: "#9CA3AF", fontSize: 12 },
  productInfo: { color: "#9CA3AF", fontSize: 12, textAlign: "right" },
  addWeightBox: { marginTop: 8, minWidth: 200 },
  nutrientsCard: { backgroundColor: "#374151", padding: 10, borderRadius: 8, marginVertical: 8 },
  nutrientsTitle: { color: "white", fontWeight: "bold", marginBottom: 4 },
  nutrientsText: { color: "#D1D5DB", fontSize: 12 },
  addBtn: { backgroundColor: "#4B5563", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 4 },
  addBtnDisabled: { backgroundColor: "#6B7280" },
  addBtnText: { color: "white", fontWeight: "bold" },
  addNewBox: { marginTop: 8 },
  label: { color: "white", fontWeight: "500", marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  cancelBtn: { flex: 1, backgroundColor: "#374151", padding: 12, borderRadius: 8, alignItems: "center", marginRight: 4 },
  cancelBtnText: { color: "white", fontWeight: "bold" },
});
