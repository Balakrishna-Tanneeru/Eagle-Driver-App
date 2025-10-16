import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// ⚠️ Change IP for your real device/emulator
const API_BASE = "http://192.168.0.2:8080/api/driver/auth";

const client = axios.create({
  baseURL: API_BASE,
});

// 🔑 Attach JWT automatically
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------
// 🚖 AUTH
// ----------------------
export const registerDriver = (data) => client.post("/register", data);

export const loginDriver = (data) => client.post("/login", data);

// ----------------------
// 👤 DRIVER PROFILE
// ----------------------
export const getDriverProfile = () => client.get("/me");

export const updateDriverProfile = (data) => client.put("/update", data);

// ----------------------
// 📍 DRIVER STATUS & LOCATION
// ----------------------
export const updateDriverStatus = (available) =>
  client.put(`/status?available=${available}`);

export const updateDriverLocation = (latitude, longitude) =>
  client.put(`/location?latitude=${latitude}&longitude=${longitude}`);

// ----------------------
// 🚘 RIDES MANAGEMENT
// ----------------------
export const fetchPendingRides = async () => {
  try {
    const response = await client.get("/rides/pending");
    console.log("Pending Rides Response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching pending rides:", error);
    throw error;
  }
};

export const acceptRide = async (rideId) => {
  try {
    const response = await client.post(`/rides/${rideId}/accept`);
    console.log("Accept Ride Response:", response.data);
    return response;
  } catch (error) {
    console.error("Error accepting ride:", error);
    throw error;
  }
};

export const rejectRide = (rideId) =>
  client.post(`/rides/${rideId}/reject`);

export const completeRide = (rideId) =>
  client.post(`/rides/${rideId}/complete`);

export default client;
