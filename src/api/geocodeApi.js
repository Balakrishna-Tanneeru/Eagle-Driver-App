// src/api/geocodeApi.js
import { GOOGLE_MAPS_API_KEY } from "@env";

export async function reverseGeocode(lat, lng) {
  // Check for valid coordinates
  if (!lat || !lng) {
    console.warn("[reverseGeocode] Invalid coordinates:", lat, lng);
    return "Invalid coordinates";
  }

  // Check API key
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("[reverseGeocode] GOOGLE_MAPS_API_KEY is undefined! Did you configure @env?");
    return "API key missing";
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  console.log("[reverseGeocode] Fetching URL:", url);

  try {
    const response = await fetch(url);

    // Log HTTP status
    console.log("[reverseGeocode] HTTP status:", response.status);

    if (!response.ok) {
      console.error("[reverseGeocode] HTTP error:", response.status, response.statusText);
      return `HTTP error ${response.status}`;
    }

    const data = await response.json();
    console.log("[reverseGeocode] Response data:", data);

    if (data.status === "OK" && data.results.length > 0) {
      console.log("[reverseGeocode] Formatted address:", data.results[0].formatted_address);
      return data.results[0].formatted_address;
    } else {
      console.warn("[reverseGeocode] No results found:", data.status, data.error_message || "");
      return `No address found (${data.status})`;
    }
  } catch (error) {
    console.error("[reverseGeocode] Fetch error:", error);
    return "Error fetching address";
  }
}
