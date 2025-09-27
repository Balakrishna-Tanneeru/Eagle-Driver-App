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

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null); // profile
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRides, setPendingRides] = useState([]);

  // 🔄 Load token & profile from storage on app start
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        if (storedToken) {
          setToken(storedToken);
          await fetchProfile();
        }
      } catch (err) {
        console.error("Error loading driver from storage:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStorage();
  }, []);

  // -----------------
  // 🚖 Auth Functions
  // -----------------
  const register = async (data) => {
    const res = await registerDriver(data);
    return res.data;
  };

  const login = async (data) => {
  try {
    const res = await loginDriver(data);
    console.log("Login API Response:", res.data);

    const accessToken = res.data?.token;
    if (accessToken) {
      await AsyncStorage.setItem("accessToken", accessToken);
      setToken(accessToken);
      console.log("Token saved:", accessToken);

      await fetchProfile(); // fetch /me endpoint
    } else {
      console.error("Login failed: no token in response", res.data);
    }
    return res.data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};




  const logout = async () => {
    await AsyncStorage.removeItem("accessToken");
    setToken(null);
    setDriver(null);
  };

  // -----------------
  // 👤 Profile
  // -----------------
  const fetchProfile = async () => {
    try {
      const res = await getDriverProfile();
      setDriver(res.data);
    } catch (err) {
      console.error("Error fetching driver profile:", err);
    }
  };

  const updateProfile = async (data) => {
    const res = await updateDriverProfile(data);
    setDriver(res.data);
  };

  // -----------------
  // 📍 Status & Location
  // -----------------
  const setAvailability = async (available) => {
    await updateDriverStatus(available);
  };

  const updateLocation = async (lat, lng) => {
    await updateDriverLocation(lat, lng);
  };

  // -----------------
  // 🚘 Rides
  // -----------------
  const loadPendingRides = async () => {
    const res = await fetchPendingRides();
    setPendingRides(res.data);
  };

  const accept = async (rideId) => {
    await acceptRide(rideId);
    await loadPendingRides();
  };

  const reject = async (rideId) => {
    await rejectRide(rideId);
    await loadPendingRides();
  };

  const complete = async (rideId) => {
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
