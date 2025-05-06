import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/config';
import axios from "axios";

const NewChallenge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    if (location.state?.selected) {
      setSelected(location.state.selected);
    }
  }, [location.state]);

  // const handleSubmit = async () => {
  //   if (!date || !start || !end) {
  //     alert("Please fill all fields");
  //     return;
  //   }

  //   // Combine date and time into a JS Date object
  //   const selectedStartDateTime = new Date(`${date}T${start}`);
  //   const now = new Date();

  //   const isActiveNow = selectedStartDateTime <= now;
  //   const status = isActiveNow ? "Active" : "Pending";
  //   const userId = "680c69ca2c6262762bea2159";
  //   const token = localStorage.getItem("token");

  //   try {
  //     const response = await axios.post(`${API_URL}/api/challenges/${userId}`, {
  //       title: selected?.name || "Untitled Challenge",
  //       userId: userId,
  //       startDate: date,
  //       startTime: start,
  //       endTime: end,
  //       status: status,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //     if (response.status === 200 || response.status === 201) {
  //       alert("Challenge saved successfully!");
  //       const challengeId = response.data.id;
        
  //       if (isActiveNow) {
  //         navigate(`/challenge/${challengeId}/start`);
  //       } else {
  //         navigate("/challenges");
  //       }
  //     }
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       alert("Unauthorized. Please log in again.");
  //       navigate("/login");
  //     } else {
  //       alert("Error creating challenge. Please try again.");
  //     }
  //     console.error("Challenge creation error:", error);
  //   }
  // };

  const handleSubmit = async () => {
    if (!date || !start || !end) {
      alert("Please fill all fields");
      return;
    }
  
    // Combine date and time into a JS Date object
    const selectedStartDateTime = new Date(`${date}T${start}`);
    const now = new Date();
  
    const isActiveNow = selectedStartDateTime <= now;
    const status = isActiveNow ? "Active" : "Pending";
    const userId = "680c69ca2c6262762bea2159";
  
    // const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Authorization token missing. Please log in again.");
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch(
        `${API_URL}/api/challenges/${userId}`,
        {
          method: 'POST',
        },
        {
          title: selected?.name || "Untitled Challenge",
          userId: userId,
          startDate: date,
          startTime: start,
          endTime: end,
          status: status,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        alert("Challenge saved successfully!");
        const challengeId = response.data.id;
  
        if (isActiveNow) {
          navigate(`/challenge/${challengeId}/start`);
        } else {
          navigate("/challenges");
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Unauthorized. Please log in again.");
        navigate("/login");
      } else {
        alert("Error creating challenge. Please try again.");
      }
      console.error("Challenge creation error:", error);
    }
  };
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Start Challenge for {selected?.name || "..."}</h2>

      <div className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Challenge
        </button>
      </div>
    </div>
  );
};

export default NewChallenge;
