import { useContext, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { DriverContext } from "../context/DriverContext";

export default function ProfileScreen() {
  const { driver, updateProfile, logout } = useContext(DriverContext);

  const [name, setName] = useState(driver?.name || "");
  const [email, setEmail] = useState(driver?.email || "");
  const [phone, setPhone] = useState(driver?.phone || "");

  const handleUpdate = async () => {
    try {
      await updateProfile({ name, email, phone });
      Alert.alert("Profile updated successfully");
    } catch (err) {
      Alert.alert("Error", err.message || "Unable to update profile");
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold mb-2">Profile</Text>

      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} className="border p-2 mb-2" />

      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} className="border p-2 mb-2" />

      <Text>Phone</Text>
      <TextInput value={phone} onChangeText={setPhone} className="border p-2 mb-2" />

      <Button title="Update Profile" onPress={handleUpdate} className="mb-2" />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
