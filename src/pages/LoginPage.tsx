import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import { ApiClient, LoginModel, RegisterModel } from "../shared/api/g";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginPageProps {
  apiClient: ApiClient;
  onLoginSuccess: () => void;
}

export function LoginPage({ apiClient, onLoginSuccess }: LoginPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);

  // Поля для логина
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Поля для регистрации
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.login({ userName: username, password } as LoginModel);
      await AsyncStorage.setItem("jwt", result.token!);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message ?? "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.register({ fullName, userName: username, password } as RegisterModel);
      setIsRegistering(false);
      setUsername("");
      setPassword("");
      setFullName("");
      Alert.alert("Регистрация прошла успешно. Войдите в систему.");
    } catch (err: any) {
      setError(err.message ?? "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>{isRegistering ? "Регистрация" : "Вход"}</Text>

        {isRegistering && (
          <TextInput
            placeholder="ФИО"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />
        )}

        <TextInput
          placeholder="Логин"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={isRegistering ? handleRegister : handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{isRegistering ? "Регистрация" : "Войти"}</Text>
        </Pressable>

        <Pressable onPress={() => setIsRegistering(!isRegistering)} style={styles.switchBtn}>
          <Text style={styles.switchBtnText}>
            {isRegistering
              ? "Уже есть аккаунт? Войти"
              : "Нет аккаунта? Зарегистрируйтесь"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  innerContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 20 },
  input: {
    width: "100%",
    backgroundColor: "#1F2937",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#6B7280" },
  buttonText: { color: "white", fontWeight: "bold" },
  switchBtn: { marginTop: 12 },
  switchBtnText: { color: "#9CA3AF", textAlign: "center" },
  error: { color: "#F87171", marginBottom: 8, textAlign: "center" },
});
