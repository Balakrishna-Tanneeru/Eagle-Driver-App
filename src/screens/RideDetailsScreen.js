import { useContext } from "react";
import { Alert, Button, Text, View } from "react-native";
import { DriverContext } from "../context/DriverContext";

export default function RideDetailsScreen({ route, navigation }) {
  const { accept, reject, complete } = useContext(DriverContext);
  const { ride } = route.params; // ride object passed from PendingRidesScreen

  const handleAccept = async () => {
    try {
      await accept(ride.id);
      Alert.alert("Ride accepted");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to accept ride");
    }
  };

  const handleReject = async () => {
    try {
      await reject(ride.id);
      Alert.alert("Ride rejected");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to reject ride");
    }
  };

  const handleComplete = async () => {
    try {
      await complete(ride.id);
      Alert.alert("Ride completed");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to complete ride");
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-2">Ride Details</Text>
      <Text>ID: {ride.id}</Text>
      <Text>Pickup: {ride.pickup}</Text>
      <Text>Drop: {ride.drop}</Text>
      <Text>Fare: ₹{ride.fare}</Text>
      <Text>Status: {ride.status}</Text>

      <View className="mt-4">
        <Button title="Accept Ride" onPress={handleAccept} />
        <Button title="Reject Ride" onPress={handleReject} color="red" />
        <Button title="Complete Ride" onPress={handleComplete} color="green" />
      </View>
    </View>
  );
}
