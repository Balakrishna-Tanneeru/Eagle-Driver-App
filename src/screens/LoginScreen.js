import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { DriverContext } from "../context/DriverContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(DriverContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (!res?.token) {
        Alert.alert("Login failed", "No token received.");
      }
    } catch (err) {
      Alert.alert(
        "Login failed",
        err.response?.data?.message || err.message || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
{/* Header */}
{/* Header */}
<View style={styles.header}>
  {/* Eagle logo */}
  <Text style={{ fontSize: 60 }}>🦅</Text>

  {/* Rider on Bike emoji */}
  <Text style={{ fontSize: 50, marginTop: 5 }}>🏍️</Text>

  {/* App Title */}
  <Text style={styles.title}>Eagle Driver</Text>

  {/* Subtitle */}
  <Text style={styles.subtitle}>Sign in to accept rides</Text>
</View>



      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, borderWidth: 0 }]}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons name={secure ? "eye-off" : "eye"} size={22} color="#555" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#999" }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.link}>New driver? Register here</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    color: "#007BFF",
    textAlign: "center",
    fontSize: 14,
  },
});
