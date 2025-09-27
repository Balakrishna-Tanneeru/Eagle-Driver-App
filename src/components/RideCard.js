import { Button, StyleSheet, Text, View } from "react-native";

export default function RideCard({ ride, onAccept, onReject }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Ride #{ride.id}</Text>
      <Text>Pickup: {ride.pickupLocation}</Text>
      <Text>Dropoff: {ride.dropoffLocation}</Text>
      <Text>Fare: ₹{ride.fare}</Text>

      <View style={styles.buttonRow}>
        <Button title="Accept" onPress={onAccept} color="green" />
        <Button title="Reject" onPress={onReject} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
