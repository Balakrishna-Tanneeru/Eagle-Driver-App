// src/api/user.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './client'; // Axios instance with token & refresh handling

/**
 * 🔐 Optional: Retrieve stored access token
 */
export const getAuthToken = async () => {
  return await AsyncStorage.getItem('accessToken'); // make sure to use accessToken key consistently
};

/**
 * ⚠️ Centralized error handler
 */
const handleApiError = (error, fallbackMessage) => {
  console.error('User API Error:', error?.response?.data || error.message);
  const message = error?.response?.data?.error || fallbackMessage;
  throw new Error(message);
};

/**
 * 👤 Fetch the logged-in user's profile
 * GET /api/user/profile
 */
export const getUserProfile = async () => {
  try {
    const response = await API.get('/user/profile');
    const user = response.data;

    // ✅ Ensure roles array is normalized
    user.roles = Array.isArray(user.roles) ? user.roles : [];

    return user;
  } catch (error) {
    handleApiError(error, 'Failed to fetch user profile');
  }
};

/**
 * ✏️ Update user profile
 * PUT /api/user/profile
 * @param {Object} profileUpdate - e.g. { name, phone }
 */
export const updateUserProfile = async (profileUpdate) => {
  try {
    const response = await API.put('/user/profile', profileUpdate);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update profile');
  }
};

/**
 * 📜 Get ride history of the user
 * GET /api/user/ride-history
 */
export const getUserRides = async () => {
  try {
    const response = await API.get('/user/ride-history');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch ride history');
  }
};
