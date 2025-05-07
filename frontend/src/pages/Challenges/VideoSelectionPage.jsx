import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const sampleRecipes = [
  {
    id: 1,
    name: "Pasta Carbonara",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    name: "Classic Pancakes",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 3,
    name: "Chicken Curry",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

const VideoSelectionPage = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const userId = user?.id;

  console.log('Token:', token);

  const handleSelect = (recipe) => {
    setSelected(recipe);

    // Navigate to New Challenge page after short delay
    setTimeout(() => {
      navigate("/new-challenge");
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Select a Recipe Video</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {sampleRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => handleSelect(recipe)}
            className={`cursor-pointer border rounded-lg p-2 shadow hover:shadow-lg transition ${
              selected?.id === recipe.id
                ? "border-green-500 ring-2 ring-green-400"
                : ""
            }`}
          >
            <video className="w-full h-40 object-cover rounded" controls muted>
              <source src={recipe.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="mt-2 text-center font-medium">{recipe.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSelectionPage;
