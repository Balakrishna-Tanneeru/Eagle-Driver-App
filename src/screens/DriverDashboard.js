import { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { DriverContext } from "../context/DriverContext";

export default function DriverDashboard({ navigation }) {
  const { driver, logout } = useContext(DriverContext);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome, {driver?.name || "Driver"} 👋
      </Text>

      {driver && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📧 {driver.email}</Text>
          <Text style={styles.infoText}>📱 {driver.phone}</Text>
          <Text style={styles.infoText}>
            🚘 {driver.vehicleModel} ({driver.vehicleNumber})
          </Text>
          <Text style={styles.infoText}>🪪 {driver.licenseNumber}</Text>
        </View>
      )}

      <View style={styles.buttonBox}>
        <Button
          title="My Profile"
          onPress={() => navigation.navigate("Profile")}
        />
        <Button
          title="Pending Rides"
          onPress={() => navigation.navigate("PendingRides")}
        />
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    marginBottom: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonBox: {
    gap: 12,
  },
});
