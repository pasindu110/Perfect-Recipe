import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const NewChallenge = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

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
      const response = await axios.post("/api/challenges", {
        title: selected?.name || "Untitled Challenge",
        startDate: date,
        startTime: start,
        endTime: end,
        status: status,
        userId: "user123", // Replace with actual user ID
      });

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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Challenge
        </button>
      </div>
    </div>
  );
};

export default NewChallenge;
