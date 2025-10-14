import * as Location from "expo-location";
import api from "../api/api"; // axios instance with baseURL + token

let intervalId = null;

export async function startLocationUpdates(rideId = null, status = null) {
  // Ask permission
  let { status: permStatus } = await Location.requestForegroundPermissionsAsync();
  if (permStatus !== "granted") {
    alert("Permission to access location was denied");
    return;
  }

  // Clear existing interval if running
  if (intervalId) stopLocationUpdates();

  // Update every 10 seconds
  intervalId = setInterval(async () => {
    let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;

    try {
      await api.put("/api/driver/location", {
        latitude,
        longitude,
        rideId,    // attach ride if active
        status,    // optionally "ACCEPTED", "STARTED", etc.
      });
      console.log("📡 Location pushed:", latitude, longitude);
    } catch (err) {
      console.error("❌ Failed to push location", err.message);
    }
  }, 10000); // every 10 sec
}

export function stopLocationUpdates() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
