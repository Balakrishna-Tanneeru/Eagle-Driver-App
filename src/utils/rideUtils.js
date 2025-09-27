// src/utils/rideUtils.js

/**
 * Calculates the Haversine distance between two coordinates in kilometers.
 */
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculates fare based on distance.
 * Example logic: ₹20 base fare + ₹10/km
 */
export function calculateFare(distanceInKm) {
  const baseFare = 20; // Base fare in INR
  const ratePerKm = 10; // Rate per kilometer in INR

  return Math.round(baseFare + distanceInKm * ratePerKm);
}
