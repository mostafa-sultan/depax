// productSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchContent = createAsyncThunk(
//   'content/fetchContent',
//   async () => {
//     const res = await axios('https://api.npoint.io/40d1d06f2019296b4932')
//     const data = await res.data
//     return data
//   }
// )

const productSlice = createSlice({
  name: 'product',
  initialState: {
    appointments: [
      { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
      { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 5 },
      { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
      { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
      { "appointments": [{ "from": [], "to": [] }], "examinationDuration": 0 },
    ],
    dayInputLenth: [[0], [0], [0], [0], [0]],
    data: [],
    completeAccountToken:null,
    isLoading: false,

  },
  // initialState: { products: null },
  reducers: {
    restState: (state, action) => {
      state.data = []
      console.log("set product" + JSON.stringify(state.data));
    }, 
    setAuth: (state, action) => {
      state.completeAccountToken=action.payload.completeAccountToken
      console.log("completeAccountToken" + JSON.stringify(state.completeAccountToken));
    },
    updateAppointments: (state, action) => {

      let prevAppointments = state.appointments
      const dayIndex = action.payload.dayIndex
      const index = action.payload.index
      const cleanedInput = action.payload.text
      const type = action.payload.type
      if (cleanedInput.length == 4) {
        if (type == "f") {
          const updatedAppointments = [...prevAppointments];
          updatedAppointments[dayIndex].appointments[index].from = `${cleanedInput.slice(0, 2)}:${cleanedInput.slice(2)}`
          console.log('updatedAppointments' + JSON.stringify(updatedAppointments));
          state.appointments = updatedAppointments;
        } else if (type == "t") {
          const updatedAppointments = [...prevAppointments];
          updatedAppointments[dayIndex].appointments[index].to = `${cleanedInput.slice(0, 2)}:${cleanedInput.slice(2)}`
          console.log('updatedAppointments' + JSON.stringify(updatedAppointments));
          state.appointments = updatedAppointments;
        }

      }
 
    },
    selectDurationAppointment: (state, action) => { 
      const dayIndex = action.payload.dayIndex
      const duration = action.payload.duration
      state.appointments[dayIndex].examinationDuration=duration  
      console.log(state.appointments);

    },
    addTimeInput: (state, action) => {
      let prevAppointments = state.appointments
      const dayIndex = action.payload.dayIndex
      state.dayInputLenth[dayIndex]=[...state.dayInputLenth[dayIndex], 0] 
          const updatedAppointments = [...prevAppointments];
          updatedAppointments[dayIndex] = { appointments: [...prevAppointments[dayIndex].appointments, { "from": [], "to": [] }] };
          state.appointments = updatedAppointments; 
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchContent.pending, (state) => {
      console.log('isLoading');
      state.isLoading = true
    })
    builder.addCase(fetchContent.fulfilled, (state, action) => {
      state.isLoading = false
      console.info("api data get succsesfull ");
      state.data = [...state.data, ...action.payload.data]
      console.log("state" + JSON.stringify(state.data));

    })
    builder.addCase(fetchContent.rejected, (state, action) => {
      state.isLoading = false
      console.log("error in get data" + action.error.message);
      state.error = action.error.message
    })
  },
});

export const { restState, updateAppointments, addTimeInput, selectDurationAppointment, setAuth } = productSlice.actions;

export default productSlice.reducer;