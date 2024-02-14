// store.js
import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../reducers/dataSlice'; 

 
const store = configureStore({
  reducer: {
    product: productReducer, 
  },
  
});

export default store;