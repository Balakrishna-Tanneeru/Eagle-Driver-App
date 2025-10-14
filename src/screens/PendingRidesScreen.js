import { useContext, useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DriverContext } from "../context/DriverContext";

export default function PendingRidesScreen() {
  const { pendingRides, loadPendingRides } = useContext(DriverContext);

  useEffect(() => {
    loadPendingRides();
  }, []);

  if (!pendingRides) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚕 Pending Rides..</Text>
      <FlatList
        data={pendingRides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Pickup:</Text>
            <Text style={styles.value}>{item.pickupAddress}</Text>

            <Text style={styles.label}>Drop:</Text>
            <Text style={styles.value}>{item.dropAddress}</Text>

            <Text style={styles.label}>Fare:</Text>
            <Text style={styles.value}>₹{item.fare}</Text>

            <Text style={styles.label}>Distance:</Text>
            <Text style={styles.value}>{item.distance} km</Text>

            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.acceptText}>Accept Ride</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 2,
  },
  label: { fontWeight: "bold", marginTop: 4 },
  value: { marginBottom: 6 },
  acceptBtn: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  acceptText: { color: "#fff", fontWeight: "bold" },
});
