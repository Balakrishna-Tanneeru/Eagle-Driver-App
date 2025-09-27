import { useContext, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { DriverContext } from "../context/DriverContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(DriverContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        phone,
        licenseNumber,
        vehicleNumber,
        vehicleModel,
      });
      Alert.alert("Success", "Account created! Please log in.");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert(
        "Registration failed",
        err.response?.data?.message || err.message || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} className="border p-2 mb-2" />

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

      <Text>Phone</Text>
      <TextInput value={phone} onChangeText={setPhone} className="border p-2 mb-2" />

      <Text>License Number</Text>
      <TextInput
        value={licenseNumber}
        onChangeText={setLicenseNumber}
        className="border p-2 mb-2"
      />

      <Text>Vehicle Number</Text>
      <TextInput
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
        className="border p-2 mb-2"
      />

      <Text>Vehicle Model</Text>
      <TextInput
        value={vehicleModel}
        onChangeText={setVehicleModel}
        className="border p-2 mb-2"
      />

      <Button
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
}
