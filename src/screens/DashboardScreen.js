import { useContext, useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";
import { DriverContext } from "../context/DriverContext";

export default function DashboardScreen() {
  const { driver, pendingRides, loadPendingRides, accept, reject } =
    useContext(DriverContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      await loadPendingRides();
      setLoading(false);
    };
    fetchRides();
  }, []);

  const handleAccept = async (rideId) => {
    try {
      await accept(rideId);
      Alert.alert("Ride accepted");
    } catch (err) {
      Alert.alert("Error", err.message || "Unable to accept ride");
    }
  };

  const handleReject = async (rideId) => {
    try {
      await reject(rideId);
      Alert.alert("Ride rejected");
    } catch (err) {
      Alert.alert("Error", err.message || "Unable to reject ride");
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg mb-2">Welcome, {driver?.name || "Driver"}</Text>
      <Text className="text-lg font-bold mb-2">Pending Rides</Text>

      {loading ? (
        <Text>Loading rides...</Text>
      ) : pendingRides.length === 0 ? (
        <Text>No pending rides</Text>
      ) : (
        <FlatList
          data={pendingRides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="border p-2 mb-2">
              <Text>Pickup: {item.pickupLocation}</Text>
              <Text>Drop: {item.dropLocation}</Text>
              <Text>Fare: ₹{item.fare}</Text>
              <View className="flex-row justify-between mt-2">
                <Button title="Accept" onPress={() => handleAccept(item.id)} />
                <Button title="Reject" onPress={() => handleReject(item.id)} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
