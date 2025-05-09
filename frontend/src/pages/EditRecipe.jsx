import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/config';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    ingredients: [''],
    instructions: [''],
    image: '',
    nutritionFacts: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    },
    videoUrl: ''
  });
  const [videoType, setVideoType] = useState(recipe.videoUrl && recipe.videoUrl.includes('youtube.com') ? 'youtube' : 'file');
  const [recipeVideo, setRecipeVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState(recipe.videoUrl || '');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/api/recipes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Recipe not found');
          } else if (response.status === 403) {
            throw new Error('Access denied');
          }
          throw new Error('Failed to load recipe');
        }

        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(error.message);
        toast.error(error.message);
        if (error.message === 'Authentication required') {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRecipe(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setRecipe(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeIngredient = (index) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const removeInstruction = (index) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setRecipe(prev => ({
        ...prev,
        image: file,
        imagePreview: previewUrl
      }));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        toast.error('Video size should not exceed 30MB');
        return;
      }
      setRecipeVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (recipe.imagePreview) {
        URL.revokeObjectURL(recipe.imagePreview);
      }
    };
  }, [recipe.imagePreview]);

  const getImageSrc = (imageData) => {
    if (!imageData) return '/default-recipe-image.jpg';
    
    // If it's a preview URL, return it
    if (typeof imageData === 'string' && imageData.startsWith('blob:')) {
      return imageData;
    }
    
    // If it's already a data URL, return it
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      return imageData;
    }
    
    // If it's a URL, return it
    if (typeof imageData === 'string' && imageData.startsWith('http')) {
      return imageData;
    }
    
    // If it's a base64 string without prefix, try to add the prefix
    if (typeof imageData === 'string' && /^[A-Za-z0-9+/=]+$/.test(imageData)) {
      return `data:image/jpeg;base64,${imageData}`;
    }
    
    return '/default-recipe-image.jpg';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      
      // Create the recipe data object
      const recipeData = {
        title: recipe.title,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cuisine: recipe.cuisine,
        categories: recipe.categories
      };

      let response;
      
      if (recipe.image instanceof File) {
        // If there's a new image, use FormData
        const formData = new FormData();
        
        // Add the recipe data as a JSON string
        formData.append('recipeData', JSON.stringify(recipeData));
        
        // Add the image file
        formData.append('file', recipe.image);

        if (videoType === 'file' && recipeVideo) {
          formData.append('video', recipeVideo);
        }
        if (videoType === 'youtube' && youtubeLink) {
          formData.append('videoUrl', youtubeLink);
        }

        response = await fetch(`${API_URL}/api/recipes/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } else {
        // If no new image, send as JSON
        response = await fetch(`${API_URL}/api/recipes/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(recipeData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update recipe. Status: ${response.status}`);
      }

      toast.success('Recipe updated successfully');
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error(error.message || 'Failed to update recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
          <button
            onClick={() => navigate('/recipes')}
            className="mt-4 bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition duration-300"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Recipe</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={recipe.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={recipe.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preparation Time (minutes)
              </label>
              <input
                type="number"
                name="prepTime"
                value={recipe.prepTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cooking Time (minutes)
              </label>
              <input
                type="number"
                name="cookTime"
                value={recipe.cookTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Servings
              </label>
              <input
                type="number"
                name="servings"
                value={recipe.servings}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
              />
              {(recipe.imagePreview || recipe.image) && (
                <img
                  src={getImageSrc(recipe.imagePreview || recipe.image)}
                  alt="Current recipe"
                  className="mt-2 h-32 w-32 object-cover rounded"
                />
              )}
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <div className="space-y-4">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-rose-500 hover:text-rose-700"
            >
              + Add Ingredient
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center mt-2">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <textarea
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
                    rows="3"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="mt-2 text-rose-500 hover:text-rose-700"
            >
              + Add Instruction
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recipe Video</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe video (max 30MB, 30 seconds) or YouTube link:
            </label>
            <div className="flex gap-4 mb-2">
              <label>
                <input
                  type="radio"
                  checked={videoType === 'file'}
                  onChange={() => setVideoType('file')}
                /> Upload File
              </label>
              <label>
                <input
                  type="radio"
                  checked={videoType === 'youtube'}
                  onChange={() => setVideoType('youtube')}
                /> YouTube Link
              </label>
            </div>
            {videoType === 'file' ? (
              <>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
                {videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    width="320"
                    height="180"
                    className="mt-2 rounded"
                  />
                ) : recipe.videoUrl && !recipe.videoUrl.includes('youtube.com') ? (
                  <video
                    src={`http://localhost:8080${recipe.videoUrl}`}
                    controls
                    width="320"
                    height="180"
                    className="mt-2 rounded"
                  />
                ) : null}
              </>
            ) : (
              <input
                type="text"
                value={youtubeLink}
                onChange={e => setYoutubeLink(e.target.value)}
                placeholder="Paste YouTube link here"
                className="w-full px-4 py-2 border rounded-md"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/recipes/${id}`)}
            className="bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition duration-300"
          >
            {isSubmitting ? 'Updating...' : 'Update Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;