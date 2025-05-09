import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';

export default function EditChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    recipeId: "",
    startDate: "",
    startTime: "",
    endTime: "",
    status: "pending"
  });
  const { user, token } = useAuth();
  const userId = user?.id;


  useEffect(() => {
    fetchChallengeAndRecipes();
  }, [id]);

  const fetchChallengeAndRecipes = async () => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  
      const [challengeRes, recipesRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/challenges/${id}/all`, headers),
        axios.get("http://localhost:8080/api/recipes", headers)
      ]);
  
      const fetchedChallenge = challengeRes?.data;
      const fetchedRecipes = Array.isArray(recipesRes?.data) ? recipesRes.data : [];
      console.log("Fetched challenge:", fetchedChallenge);

  
      if (!Array.isArray(recipesRes?.data)) {
        console.warn("Expected recipes to be an array but got:", recipesRes?.data);
      }
  
      setChallenge(fetchedChallenge);
      setRecipes(fetchedRecipes);
  
      setForm({
        recipeId: fetchedChallenge.recipeId,
        startDate: fetchedChallenge.startDate,
        startTime: fetchedChallenge.startTime,
        endTime: fetchedChallenge.endTime,
        status: "Pending"
      });
    } catch (err) {
      console.error("Error fetching challenge or recipes", err);
    }
  };
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.put(`http://localhost:8080/api/challenges/${id}`, form, { headers });
      
      navigate("/challenges/${userId}");
    } catch (err) {
      console.error("Failed to update challenge", err);
    }
  };

  if (!challenge) {
    console.log("Challenge is still loading or failed to load:", challenge);
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Challenge</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Recipe</label>
          <select
            name="recipeId"
            value={form.recipeId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-gray-200"
            disabled
          >
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">End Time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button type="submit" className="bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600">
          Save Changes
        </button>
      </form>
    </div>
  );
}
