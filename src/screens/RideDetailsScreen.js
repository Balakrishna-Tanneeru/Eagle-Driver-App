import { useRoute } from "@react-navigation/native";
import { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { DriverContext } from "../context/DriverContext";
import { log } from "../utils/logger";

export default function RideDetailsScreen() {
  const { params } = useRoute();
  const { complete } = useContext(DriverContext);
  const rideId = params?.rideId;

  const handleComplete = async () => {
    log(`🏁 Completing ride ${rideId}`);
    await complete(rideId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Details</Text>
      <Text>Ride ID: {rideId}</Text>

      <Button title="🏁 Complete Ride" onPress={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
