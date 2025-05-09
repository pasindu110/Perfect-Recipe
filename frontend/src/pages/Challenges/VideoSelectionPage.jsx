import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import axios from "axios";

const VideoSelectionPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const userId = user?.id;

  console.log('Token:', token);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecipes(response.data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };

    fetchRecipes();
  }, [token]);
  

  const handleSelect = (recipe) => {
    console.log("Selected recipe to send:", recipe);
    setSelected(recipe);
    setLoading(true);

    setTimeout(() => {
      navigate("/new-challenge", {
        state: {
          selectedRecipe: recipe,
          userId: user?.id,
        },
      });
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Select a Recipe</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => handleSelect(recipe)}
            className={`cursor-pointer border rounded-lg p-2 shadow hover:shadow-lg transition ${
              selected?.id === recipe.id
                ? "border-green-500 ring-2 ring-green-400"
                : ""
            }`}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-2 text-lg font-medium text-center">{recipe.title}</h3>
            <p className="text-sm">By {recipe.author}</p>
          </div>
        ))}
      </div>
      {loading && (
        <p className="text-center text-green-600 font-semibold">
          Preparing your challenge...
        </p>
      )}
    </div>
  );
};

export default VideoSelectionPage;
