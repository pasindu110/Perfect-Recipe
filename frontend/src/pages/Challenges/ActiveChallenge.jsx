import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';

export default function ActiveChallenge() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [timerInterval, setTimerInterval] = useState(null);
  const { user, token } = useAuth();
  const userId = user?.id;


  console.log('Token:', token);
  // Mock Data
  const mockChallenge = {
    id: "1",
    date: "2025-04-07",
    startTime: "10:00",
    endTime: "10:30",
    recipeId: "r1",
    status: "planned",
  };

  const mockRecipe = {
    id: "r1",
    title: "Mock Recipe",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  };

  useEffect(() => {
    setTimeout(() => {
      setChallenge(mockChallenge);
      setRecipe(mockRecipe);
    }, 500);
  }, [id]);

  useEffect(() => {
    if (challenge) {
      const end = new Date(`${challenge.date}T${challenge.endTime}`);
      const interval = setInterval(() => {
        const now = new Date();
        const diff = end - now;
        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
        } else {
          setTimeLeft(Math.floor(diff / 1000));
        }
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [challenge]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  // const handleFinish = async () => {
  //   try {
  //     setIsUploading(true);
  //     clearInterval(timerInterval); // Stop the timer if running
  
  //     const uploadedImages = images.map((file) => URL.createObjectURL(file)); // Replace with real URLs if needed
  
  //     await axios.put(`http://localhost:8080/api/challenges/${id}/finish`, uploadedImages); // Call backend to mark as completed
  //     console.log("Challenge marked as completed and images uploaded");
  //   } catch (err) {
  //     console.error("Error finishing challenge:", err);
  //   }
  // };

  const handleFinish = async () => {
    try {
      setIsUploading(true);
      clearInterval(timerInterval); // Stop the timer if running
  
      const uploadedImages = images.map((file) => URL.createObjectURL(file));

      await axios.put(
        `http://localhost:8080/api/challenges/${id}/finish`,
        uploadedImages, // Send as object (adjust based on backend expectations)
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      console.log("Challenge marked as completed and images uploaded");
    } catch (err) {
      console.error("Error finishing challenge:", err);
    }
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Only up to 3 photos allowed.");
      return;
    }
    setImages(files);
    setSuccess(true);
  
    setTimeout(() => {
      navigate(`/challenges/${userId}`);
    }, 3000);
  };

  const handlePause = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/challenges/${id}/pause`,
        {}, // no body, but you still need this placeholder for the next config param
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Paused and saved to DB");
      navigate(`/challenges/${userId}`); // Navigate after updating
    } catch (err) {
      console.error("Error pausing challenge:", err);
    }
  };  

  if (!challenge || !recipe) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
        onClick={handlePause}
        className="mb-4 bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-rose-700 transition"
      >
        Pause & Go to Challenges Page
      </button>

      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>

      <video
        src={recipe.videoUrl}
        controls
        autoPlay
        className="w-full mt-4 mb-4 rounded"
      />

      {timeLeft !== null && (
        <p className="text-red-600 font-semibold mb-4">
          Time Left: {formatTime(timeLeft)}
        </p>
      )}

      <button
        onClick={handleFinish}
        className="bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-rose-700 transition mb-4"
      >
        Finish Challenge
      </button>

      {isUploading && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Upload up to 3 photos:</label>
          <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded inline-block text-sm text-gray-700">
            Upload Pictures
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {success && (
        <div className="bg-rose-600 border border-green-400 text-green-700 px-4 py-3 rounded mt-2">
          Photos uploaded successfully!
        </div>
      )}
    </div>
  );
}

