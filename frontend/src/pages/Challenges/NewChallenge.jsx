import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import axios from "axios";

const NewChallenge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const { user, token } = useAuth();
  const [end, setEnd] = useState("");
  const userId = user?.id;// Replace this with dynamic auth user ID

  console.log('Token:', token);

  useEffect(() => {
    if (location.state?.selected) {
      setSelected(location.state.selected);
    }
  }, [location.state]);

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

    try {
        const response = await axios.post("http://localhost:8080/api/challenges", {
            title: selected?.name || "Untitled Challenge",
            startDate: date,
            startTime: start,
            endTime: end,
            status: status,
            userId: userId, // Use the actual user ID
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });


      if (response.status === 200 || response.status === 201) {
        alert("Challenge saved successfully!");
        const challengeId = response.data.id;
        
        if (isActiveNow) {
          navigate(`/challenge/${challengeId}/start`);
        } else {
          navigate("/challenges/${userId}");
        }
      }
    } catch (error) {
      alert("Error creating challenge. Please try again.");
      console.error(error);
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
          className="px-4 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700"
        >
          Submit Challenge
        </button>
      </div>
    </div>
  );
};

export default NewChallenge;
