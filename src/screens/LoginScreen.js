import { useContext, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { DriverContext } from "../context/DriverContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(DriverContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    // ❌ Don't call navigation here
    // ✅ Context + AppNavigator will handle redirect automatically
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
    <View className="flex-1 justify-center p-4">
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="border p-2 mb-2"
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border p-2 mb-2"
      />

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}
