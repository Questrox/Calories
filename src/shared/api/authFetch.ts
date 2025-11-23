import AsyncStorage from "@react-native-async-storage/async-storage";

export async function authFetch(url: RequestInfo, init: RequestInit = {}) {
  const token = await AsyncStorage.getItem("jwt");

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...init,
    headers,
  });
}

