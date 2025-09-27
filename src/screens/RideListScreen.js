import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { acceptRide, getPendingRides, rejectRide } from "../api/rideApi";
import RideCard from "../components/RideCard";

export default function RideListScreen() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const res = await getPendingRides();
      setRides(res || []);
    } catch (err) {
      console.error("Fetch rides error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleAccept = async (rideId) => {
    try {
      await acceptRide(rideId);
      Alert.alert("Success", "Ride accepted!");
      fetchRides(); // refresh list
    } catch (err) {
      console.error("Accept ride error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to accept ride");
    }
  };

  const handleReject = async (rideId) => {
    try {
      await rejectRide(rideId);
      Alert.alert("Success", "Ride rejected!");
      fetchRides();
    } catch (err) {
      console.error("Reject ride error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to reject ride");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (rides.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No pending rides available 🚖</Text>
        <Button title="Refresh" onPress={fetchRides} />
      </View>
    );
  }

  return (
    <FlatList
      data={rides}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <RideCard
          ride={item}
          onAccept={() => handleAccept(item.id)}
          onReject={() => handleReject(item.id)}
        />
      )}
      contentContainerStyle={{ padding: 10 }}
      refreshing={loading}
      onRefresh={fetchRides}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
