import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import {
  acceptRide,
  completeRide,
  fetchPendingRides,
  getDriverProfile,
  loginDriver,
  registerDriver,
  rejectRide,
  updateDriverLocation,
  updateDriverProfile,
  updateDriverStatus,
} from "../api/driverApi";
import { error, log, warn } from "../utils/logger"; // ✅ use logger

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null); // profile
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRides, setPendingRides] = useState([]);

  // 🔄 Load token & profile from storage on app start
  useEffect(() => {
    log("🚀 DriverProvider mounted, checking AsyncStorage for token...");
    const loadStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        log("📦 Stored token from AsyncStorage:", storedToken);
        if (storedToken) {
          setToken(storedToken);
          await fetchProfile();
        } else {
          warn("ℹ️ No token found in storage");
        }
      } catch (err) {
        error("Error loading driver from storage:", err);
      } finally {
        setLoading(false);
        log("✅ Finished loading storage, loading state:", false);
      }
    };
    loadStorage();
  }, []);

  // -----------------
  // 🚖 Auth Functions
  // -----------------
  const register = async (data) => {
    log("📝 Registering driver with data:", data);
    const res = await registerDriver(data);
    log("✅ Register API response:", res.data);
    return res.data;
  };

  const login = async (data) => {
    log("🔑 Logging in driver with data:", data);
    try {
      const res = await loginDriver(data);
      log("✅ Login API Response:", res.data);

      const accessToken = res.data?.token;
      if (accessToken) {
        await AsyncStorage.setItem("accessToken", accessToken);
        setToken(accessToken);
        log("📦 Token saved:", accessToken);

        await fetchProfile();
      } else {
        error("Login failed: no token in response", res.data);
      }
      return res.data;
    } catch (err) {
      error("Login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    log("👋 Logging out driver...");
    await AsyncStorage.removeItem("accessToken");
    setToken(null);
    setDriver(null);
    log("✅ Token cleared, driver reset.");
  };

  // -----------------
  // 👤 Profile
  // -----------------
  const fetchProfile = async () => {
    log("👤 Fetching driver profile...");
    try {
      const res = await getDriverProfile();
      setDriver(res.data);
      log("✅ Driver profile loaded:", res.data);
    } catch (err) {
      error("Error fetching driver profile:", err);
    }
  };

  const updateProfile = async (data) => {
    log("✏️ Updating driver profile with data:", data);
    const res = await updateDriverProfile(data);
    setDriver(res.data);
    log("✅ Profile updated:", res.data);
  };

  // -----------------
  // 📍 Status & Location
  // -----------------
  const setAvailability = async (available) => {
    log("📡 Updating driver availability:", available);
    await updateDriverStatus(available);
    log("✅ Availability updated");
  };

  const updateLocation = async (lat, lng) => {
    log(`📍 Updating driver location: lat=${lat}, lng=${lng}`);
    await updateDriverLocation(lat, lng);
    log("✅ Location updated");
  };

  // -----------------
  // 🚘 Rides
  // -----------------
  const loadPendingRides = async () => {
    log("🚕 Fetching pending rides...");
    const res = await fetchPendingRides();
    setPendingRides(res.data);
    log("✅ Pending rides loaded:", res.data);
  };

  const accept = async (rideId) => {
    log("👍 Accepting ride:", rideId);
    await acceptRide(rideId);
    await loadPendingRides();
  };

  const reject = async (rideId) => {
    log("👎 Rejecting ride:", rideId);
    await rejectRide(rideId);
    await loadPendingRides();
  };

  const complete = async (rideId) => {
    log("✅ Completing ride:", rideId);
    await completeRide(rideId);
    await loadPendingRides();
  };

  return (
    <DriverContext.Provider
      value={{
        driver,
        token,
        loading,
        pendingRides,
        register,
        login,
        logout,
        fetchProfile,
        updateProfile,
        setAvailability,
        updateLocation,
        loadPendingRides,
        accept,
        reject,
        complete,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};
