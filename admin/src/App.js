
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch list of doctors from the backend API
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('https://cannula-doctors.onrender.com/dashboard/doctor/all?limit=100&page=1');
        setDoctors(response.data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);
  const acceptDoctor = async (doctorId) => {
    try {
      const response = await axios.put(`https://cannula-doctors.onrender.com/dashboard/doctor/verify/${doctorId}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {doctors.map(doctor => (
          <div key={doctor.id} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{doctor.name}</h2>
            <p>Phone Number: {doctor.phoneNumber}</p>
            <p>Specialization: {doctor.specialization.map(spec => spec.name).join(', ')}</p>
            <p>Verified: {doctor.isVerified ? 'Yes' : 'No'}</p>
            <p>Blocked: {doctor.isBlocked ? 'Yes' : 'No'}</p>
            {doctor.isVerified ? 
                 <div>
                 <button className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Accepted</button>
               </div>
              :
              <div>
                <button onClick={() => { acceptDoctor(doctor.id) }} className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Accept</button>
                <button className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2">Reject</button>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
