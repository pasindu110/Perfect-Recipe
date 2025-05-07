import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    recipeId: "",
    startDate: "",
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    fetchChallengeAndRecipes();
  }, [id]);

  const fetchChallengeAndRecipes = async () => {
    try {
      const [challengeRes, recipesRes] = await Promise.all([
        axios.get(`/api/challenges/${id}/all`),
        // axios.get(`/api/recipes`)
      ]);

      const fetchedChallenge = challengeRes?.data;
      const fetchedRecipes = recipesRes?.data || [];

      setChallenge(fetchedChallenge);
      setRecipes(fetchedRecipes);

      setForm({
        recipeId: fetchedChallenge.recipeId,
        startDate: fetchedChallenge.startDate,
        startTime: fetchedChallenge.startTime,
        endTime: fetchedChallenge.endTime
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
      await axios.put(`/api/challenges/${id}`, form);
      navigate("/challenges");
    } catch (err) {
      console.error("Failed to update challenge", err);
    }
  };

  if (!challenge) return <div>Loading...</div>;

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
