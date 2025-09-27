// src/api/auth.js

import API from './client';

/**
 * Logs in a user with email and password.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} response containing token and user object
 */
export const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login API Error:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Login failed. Please try again.');
  }
};

/**
 * Signs up a new user with the provided data.
 * @param {Object} data - { name, email, phone, password }
 * @returns {Promise<Object>} response containing token and user object
 */
export const signup = async (data) => {
  try {
    const response = await API.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    console.error('Signup API Error:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Signup failed. Please try again.');
  }
};
