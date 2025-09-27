import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { loginDriver, registerDriver } from "../api/authApi";
import client from "../api/client";
import { getCurrentDriver } from "../api/driverApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load token and profile on app start
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        if (storedToken) {
          setToken(storedToken);
          client.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          const profile = await getCurrentDriver();
          setDriver(profile);
        }
      } catch (err) {
        console.error("Auth load error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStoredData();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await loginDriver({ email, password });

      await AsyncStorage.setItem("accessToken", res.token);
      if (res.refreshToken) {
        await AsyncStorage.setItem("refreshToken", res.refreshToken);
      }

      setToken(res.token);
      client.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;

      const profile = await getCurrentDriver();
      setDriver(profile);

      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // Register
  const register = async (driverData) => {
    try {
      const res = await registerDriver(driverData);
      return res;
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      setToken(null);
      setDriver(null);
      delete client.defaults.headers.common["Authorization"];
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        driver,
        token,
        loading,
        login,
        register,
        logout,
        setDriver,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
