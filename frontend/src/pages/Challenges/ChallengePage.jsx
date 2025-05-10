import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  // const [recipes, setRecipes] = useState([]);
  const userId = user?.id;// Replace this with dynamic auth user ID
//   const userId = "680c69ca2c6262762bea2159"; 
// const userId = user?.id;

  console.log('Token:', token);

  const fetchChallenges = async () => {
    try {
      // const token = localStorage.getItem('token'); // ensure token is retrieved correctly
      const res = await axios.get(`http://localhost:8080/api/challenges/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
      console.log("Challenges:", res.data);
      setChallenges(res.data || []);
    } catch (err) {
      console.error("Error fetching challenges:", err);
      setChallenges([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchChallenges();
    }
  }, [userId, token, navigate]);

  useEffect(() => {
    if (token) {
      fetchChallenges();
    }
  }, [userId, token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this challenge?")) {
      await axios.delete(`http://localhost:8080/api/challenges/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleRestart = (id) => {
    navigate(`/challenge/${id}/start`);
  };

  const handleView = (id) => {
    navigate(`/challenge/${id}/view`);
  };

  const handleEdit = (id) => {
    navigate(`/edit-challenge/${id}/edit`);
  };

  const isExpired = (challenge) => {
    const now = new Date();
    const endDateTime = new Date(`${challenge.startDate}T${challenge.endTime}`);
    return now > endDateTime;
  };

  const getStatus = (challenge) => {
    return isExpired(challenge) ? "Expired" : challenge.status;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Your Challenges</h2>
        <Link
          to="/new-challenge"
          className="bg-rose-600 p-8 text-white px-4 py-2 rounded-full hover:bg-rose-500"
        >
          + New Challenge
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="py-3 px-6">Challenge No.</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Start Time</th>
              <th className="py-3 px-6">End Time</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((challenge,index) => (
              <tr key={challenge.id} className="border-t">
                <td className="py-4 px-6">{String(index + 1).padStart(2, '0')}</td>
                <td className="py-4 px-6">{challenge.startDate}</td>
                <td className="py-4 px-6">{challenge.startTime}</td>
                <td className="py-4 px-6">{challenge.endTime}</td>
                <td className="py-4 px-6 font-semibold">
                  {getStatus(challenge)}
                </td>
                <td className="py-4 px-6 space-x-2">
                  {getStatus(challenge) === "Completed" ? (
                    <>
                    <button
                      onClick={() => handleDelete(challenge.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                    onClick={() => handleView(challenge.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  </>
                  ) : getStatus(challenge) === "Expired" ? (
                    <button
                      onClick={() => handleDelete(challenge.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRestart(challenge.id)}
                        className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                      >
                        Restart
                      </button>
                      <button
                        onClick={() => handleEdit(challenge.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(challenge.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

