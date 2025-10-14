import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { startLocationUpdates, stopLocationUpdates } from "../services/DriverLocationService";

export default function OngoingRideScreen({ route, navigation }) {
  const { rideId } = route.params;

  useEffect(() => {
    // Start pushing location
    startLocationUpdates(rideId, "STARTED");

    return () => {
      // Stop when leaving screen
      stopLocationUpdates();
    };
  }, [rideId]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Ride in progress 🚗</Text>
      <Button title="End Ride" onPress={() => {
        stopLocationUpdates();
        navigation.navigate("RideComplete", { rideId });
      }} />
    </View>
  );
}
