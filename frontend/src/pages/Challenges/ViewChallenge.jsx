import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ViewChallenge() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios.get(`/api/challenges/${id}`).then(res => {
      setChallenge(res.data);
      return axios.get(`/api/recipes/${res.data.recipeId}`);
    }).then(res => {
      setRecipe(res.data);
    });
  }, [id]);

  if (!challenge || !recipe) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
      <p className="text-gray-600 mb-2">Date: {challenge.date}</p>
      <p className="text-gray-600 mb-2">Start: {challenge.startTime} | End: {challenge.endTime}</p>

      <div className="my-6">
        <h3 className="text-xl font-semibold mb-2">Recipe Video</h3>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={recipe.videoUrl}
            title="Recipe Video"
            className="w-full h-full rounded shadow"
            allowFullScreen
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Uploaded Dish Photos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {challenge.imageUrls && challenge.imageUrls.length > 0 ? (
            challenge.imageUrls.map((url, idx) => (
              <img key={idx} src={url} alt={`Dish ${idx + 1}`} className="w-full h-40 object-cover rounded shadow" />
            ))
          ) : (
            <p className="text-gray-500">No images uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
