import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';

export default function ViewChallenge() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const { token, user} = useAuth();
  const userId = user?.id;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const headers = {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       };
  
  //       const challengeRes = await axios.get(`http://localhost:8080/api/challenges/${userId}`, headers);
  //       setChallenge(challengeRes.data);
  //       console.log("Challenge data:", challengeRes.data);
  
  //       const recipeRes = await axios.get(`http://localhost:8080/api/recipes`, headers);
  //       setRecipe(recipeRes.data);
  //     } catch (err) {
  //       console.error("Error fetching challenge or recipe:", err);
  //     }
  //   };
  
  //   fetchData();
  // }, [id, token]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const headers = {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       };
  
  //       const challengeRes = await axios.get(`http://localhost:8080/api/challenges/${userId}`, headers);
  //       const allChallenges = challengeRes.data;
  
  //       // ✅ Get the specific challenge by URL param `id`
  //       const selectedChallenge = allChallenges.find(c => c.id === id);
  //       setChallenge(selectedChallenge);
  //       console.log("Challenge data:", selectedChallenge);
  
  //       if (selectedChallenge?.recipeId) {
  //         const recipeRes = await axios.get(`http://localhost:8080/api/recipes/${selectedChallenge.recipeId}`, headers);
  //         setRecipe(recipeRes.data);
  //         console.log("Recipe data:", recipe);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching challenge or recipe:", err);
  //     }
  //   };
  
  //   fetchData();
  // }, [id, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const challengeRes = await axios.get(`http://localhost:8080/api/challenges/${userId}`, headers);
        const allChallenges = challengeRes.data;
  
        const selectedChallenge = allChallenges.find(c => c.id === id);
        setChallenge(selectedChallenge);
        console.log("Challenge data:", selectedChallenge);
  
        if (selectedChallenge?.recipeVideoUrl) {
          // Treat recipeVideoUrl as recipeId
          const recipeRes = await axios.get(`http://localhost:8080/api/recipes/${selectedChallenge.recipeVideoUrl}`, headers);
          setRecipe(recipeRes.data);
          console.log("Recipe data:", recipeRes.data);
        }
  
      } catch (err) {
        console.error("Error fetching challenge or recipe:", err);
      }
    };
  
    fetchData();
  }, [id, token]);
  

  if (!challenge || !recipe)  {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{recipe.title}</h2>
      <p className="text-gray-600 mb-2">Date: {challenge.startDate}</p>
      <p className="text-gray-600 mb-2">Start: {challenge.startTime} | End: {challenge.endTime}</p>

      <div className="my-6">
        <h3 className="text-xl font-semibold mb-2">Recipe</h3>
        <div className="aspect-w-16 aspect-h-9">
        {recipe?.image ? (
      <img
        src={recipe.image}
        alt="Recipe Image"
        className="w-full h-full rounded shadow"
      />
    ) : (
      <p className="text-gray-500">Image not available</p>
    )}
        </div>
        <p className="text-gray-600 line-clamp-2">{recipe.description}</p>
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
