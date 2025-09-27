import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, Text, View } from "react-native";
import { DriverContext } from "../context/DriverContext";

export default function PendingRidesScreen() {
  const { pendingRides, loadPendingRides, accept, reject, complete } = useContext(DriverContext);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // track loading per ride

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      await loadPendingRides();
      setLoading(false);
    };
    fetchRides();
  }, []);

  const handleAction = async (rideId, actionFn, successMessage) => {
    try {
      setActionLoading((prev) => ({ ...prev, [rideId]: true }));
      await actionFn(rideId);
      Alert.alert("Success", successMessage);
    } catch (err) {
      Alert.alert("Error", err.message || "Action failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [rideId]: false }));
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-lg font-bold mb-2">Pending / Active Rides</Text>

      {pendingRides.length === 0 ? (
        <Text>No rides available</Text>
      ) : (
        <FlatList
          data={pendingRides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="border p-2 mb-2">
              <Text>Pickup: {item.pickupLocation}</Text>
              <Text>Drop: {item.dropLocation}</Text>
              <Text>Fare: ₹{item.fare}</Text>
              {item.status === "PENDING" ? (
                <>
                  <Button
                    title={actionLoading[item.id] ? "Accepting..." : "Accept"}
                    onPress={() => handleAction(item.id, accept, "Ride accepted")}
                    disabled={actionLoading[item.id]}
                  />
                  <Button
                    title={actionLoading[item.id] ? "Rejecting..." : "Reject"}
                    onPress={() => handleAction(item.id, reject, "Ride rejected")}
                    disabled={actionLoading[item.id]}
                  />
                </>
              ) : (
                <Button
                  title={actionLoading[item.id] ? "Completing..." : "Complete"}
                  onPress={() => handleAction(item.id, complete, "Ride completed")}
                  disabled={actionLoading[item.id]}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
