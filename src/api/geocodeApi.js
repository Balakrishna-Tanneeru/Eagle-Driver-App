// src/api/geocodeApi.js

const GOOGLE_MAPS_API_KEY = 'AIzaSyDP4l2DazPca6qzyweJmb9z1rLo2Sfmj-o'; // Replace with your actual key

export async function reverseGeocode(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      console.warn('[reverseGeocode] No results found:', data.status);
      return 'Invalid coordinates';
    }
  } catch (error) {
    console.error('[reverseGeocode] Error:', error);
    return 'Invalid coordinates';
  }
}
