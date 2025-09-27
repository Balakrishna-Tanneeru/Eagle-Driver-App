import axios from 'axios';
import * as Location from 'expo-location';
import API from './client';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDP4l2DazPca6qzyweJmb9z1rLo2Sfmj-o';

// Helper to handle API errors consistently
const handleApiError = (error) => {
  console.error('Ride API Error:', error.response?.data?.message || error.message);
  throw error;
};

// Driver actions
export const acceptRide = async (rideId) => {
  try {
    const response = await API.post(`/ride/status/${rideId}/accept`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const rejectRide = async (rideId) => {
  try {
    const response = await API.post(`/ride/status/${rideId}/reject`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const startRide = async (rideId) => {
  try {
    const response = await API.post(`/ride/status/${rideId}/start`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const completeRide = async (rideId) => {
  try {
    const response = await API.post(`/ride/status/${rideId}/complete`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const cancelRideByDriver = async (rideId) => {
  try {
    const response = await API.post(`/ride/status/${rideId}/cancel`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Rider action
export const cancelRideByRider = async (rideId) => {
  try {
    const response = await API.post(`/ride/status/${rideId}/cancel-by-rider`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch user rides
export const getMyRides = async () => {
  try {
    console.log('[getMyRides] Fetching...');
    const response = await API.get('/ride/myrides');
    console.log('[getMyRides] Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getMyRides] Error:', error?.response?.data || error.message);
    throw error;
  }
};

// Reverse geocode
const reverseGeocode = async (latitude, longitude) => {
  if (!latitude || !longitude || latitude === 0 || longitude === 0) {
    console.warn('[reverseGeocode] Invalid coordinates:', { latitude, longitude });
    return 'Invalid coordinates';
  }

  try {
    const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (addresses.length > 0) {
      const { name, street, city, region, postalCode } = addresses[0];
      const formatted = [name, street, city, region, postalCode].filter(Boolean).join(', ');
      if (formatted) return formatted;
    }
  } catch (expoError) {
    console.warn('[reverseGeocode] Expo reverse geocode failed:', expoError.message);
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await axios.get(url);
    if (res.data?.status === 'OK' && res.data.results?.length > 0) {
      return res.data.results[0].formatted_address;
    } else {
      console.warn('[reverseGeocode] Google fallback failed:', res.data?.status);
    }
  } catch (googleError) {
    console.error('[reverseGeocode] Google API error:', googleError.message);
  }

  return 'Unknown location';
};

// Request a ride (Rider)
export const requestRide = async (rideData) => {
  try {
    console.log('[requestRide] Sending ride request:', rideData);

    const { pickupLat, pickupLng, dropLat, dropLng, distance, fare } = rideData;

    console.log('[requestRide] Reverse geocoding pickup at:', pickupLat, pickupLng);
    const pickupAddress = await reverseGeocode(pickupLat, pickupLng);

    console.log('[requestRide] Reverse geocoding drop at:', dropLat, dropLng);
    const dropAddress = await reverseGeocode(dropLat, dropLng);

    const payload = {
      pickupLat,
      pickupLng,
      dropLat,
      dropLng,
      pickupAddress,
      dropAddress,
      status: 'REQUESTED',
      timestamp: new Date().toISOString(),
      distance,
      fare,
    };

    console.log('[requestRide] Final payload:', payload);

    const response = await API.post('/ride/request', payload);
    console.log('[requestRide] Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('[requestRide] Error:', error?.response?.data || error.message);
    handleApiError(error);
  }
};
