import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE = "http://192.168.0.4:8080/api/driver/auth"; // ⚠️ update IP for real device

const client = axios.create({
  baseURL: API_BASE,
});

// 🔑 Attach token automatically
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
