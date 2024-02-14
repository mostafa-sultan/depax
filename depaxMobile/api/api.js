// userService.js

import axios from 'axios';

const BASE_URL = 'https://cannula-doctors.onrender.com';
import {  useSelector } from 'react-redux';
const token = useSelector(state => state.product.completeAccountToken);
const completeAccountToken = token;

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};



const BASE_URL1 = 'https://cannula-doctors.onrender.com/doctor-app/complete-account/set-appointments/inClinic';
// userService.js

export const setaPassword = async (data ) => {
  try {
    const response = await axios.post(`${BASE_URL}/doctor-app/complete-account/set-password`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${completeAccountToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) { 
      console.error('Error setting Password:', error.response.data);
      return { error: error.response.data }; 
    } else {
      console.error('Unexpected error setting Password:', error);
      throw error;
    }
  }
};

export const setaPrice = async (data, token) => {
 
  try {
    const response = await axios.post(`${BASE_URL}/doctor-app/complete-account/set-prices`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${completeAccountToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) { 
      console.error('Error setting Password:', error.response.data);
      return { error: error.response.data }; 
    } else {
      console.error('Unexpected error setting Password:', error);
      throw error;
    }
  }
};
 
 export const setAppointments = async (data, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/doctor-app/complete-account/set-appointments/inClinic`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${completeAccountToken}`
      }
    });
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error setting appointments:', error.response.data);
    throw error;
  }
};
 

  
// Function to set the authentication token in the request headers

export const getUser = async (userId, token) => {
  try {
    // Set the authentication token in the request headers
    setAuthToken(token);

    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData, token) => {
  try {
    // Set the authentication token in the request headers
    setAuthToken(token);

    const response = await axios.post(`${BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error creating user:', error);
    throw error;
  }
};

// Other CRUD operations for users (updateUser, deleteUser, etc.) can be defined similarly
