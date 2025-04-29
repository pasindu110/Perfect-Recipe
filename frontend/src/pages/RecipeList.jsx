import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, logout, refreshToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/recipes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        // Try to refresh the token
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the fetch with new token
          const newToken = localStorage.getItem('token');
          const retryResponse = await fetch('http://localhost:8080/api/recipes', {
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!retryResponse.ok) {
            throw new Error('Failed to fetch recipes after token refresh');
          }
          
          const data = await retryResponse.json();
          // Initialize isLiked state for each recipe
          const recipesWithLikeState = data.map(recipe => ({
            ...recipe,
            isLiked: recipe.likedByUsers?.includes(user?.id) || false
          }));
          setRecipes(recipesWithLikeState);
          return;
        } else {
          // If refresh failed, logout and redirect
          await logout();
          navigate('/login');
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      // Initialize isLiked state for each recipe
      const recipesWithLikeState = data.map(recipe => ({
        ...recipe,
        isLiked: recipe.likedByUsers?.includes(user?.id) || false
      }));
      setRecipes(recipesWithLikeState);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error(error.message || 'Failed to load recipes');
      
      if (error.message.includes('token') || error.message.includes('authentication') || error.message.includes('session')) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (e, recipeId) => {
    e.stopPropagation(); // Prevent recipe card click event
    
    if (!user || !isAuthenticated) {
      toast.error('Please login to like recipes');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to like recipes');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/recipes/${recipeId}/like`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        const updatedRecipe = response.data;
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe.id === recipeId
              ? { 
                  ...recipe, 
                  likes: updatedRecipe.likes,
                  isLiked: updatedRecipe.likedByUsers?.includes(user.id)
                }
              : recipe
          )
        );
        toast.success(updatedRecipe.likedByUsers?.includes(user.id) ? 'Recipe liked!' : 'Like removed!');
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
      
      if (error.response?.status === 403 || error.response?.status === 401) {
        // Try to refresh the token
        try {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Retry the like with new token
            const newToken = localStorage.getItem('token');
            const retryResponse = await axios.post(
              `http://localhost:8080/api/recipes/${recipeId}/like`,
              {},
              {
                headers: {
                  'Authorization': `Bearer ${newToken}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (retryResponse.status === 200) {
              const updatedRecipe = retryResponse.data;
              setRecipes(prevRecipes =>
                prevRecipes.map(recipe =>
                  recipe.id === recipeId
                    ? { 
                        ...recipe, 
                        likes: updatedRecipe.likes,
                        isLiked: updatedRecipe.likedByUsers?.includes(user.id)
                      }
                    : recipe
                )
              );
              toast.success(updatedRecipe.likedByUsers?.includes(user.id) ? 'Recipe liked!' : 'Like removed!');
              return;
            }
          } else {
            toast.error('Your session has expired. Please login again.');
            await logout();
            navigate('/login');
            return;
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          toast.error('Your session has expired. Please login again.');
          await logout();
          navigate('/login');
          return;
        }
      }
      
      if (error.response?.status === 404) {
        toast.error('Recipe not found.');
      } else {
        toast.error('Failed to like recipe. Please try again.');
      }
    }
  };

  const getImageSrc = (imageData) => {
    if (!imageData) return '/default-recipe-image.jpg';
    
    // If it's already a data URL, return it
    if (imageData.startsWith('data:image')) {
      return imageData;
    }
    
    // If it's a URL, return it
    if (imageData.startsWith('http')) {
      return imageData;
    }
    
    // If it's a base64 string without prefix, try to add the prefix
    try {
      // Check if it's a valid base64 string
      if (/^[A-Za-z0-9+/=]+$/.test(imageData)) {
        // Try to determine the image type
        if (imageData.startsWith('/9j/')) {
          return `data:image/jpeg;base64,${imageData}`;
        } else if (imageData.startsWith('iVBOR')) {
          return `data:image/png;base64,${imageData}`;
        } else {
          // Default to jpeg if we can't determine
          return `data:image/jpeg;base64,${imageData}`;
        }
      }
    } catch (e) {
      console.warn('Invalid image data:', e);
    }
    
    // If all else fails, return default image
    return '/default-recipe-image.jpg';
  };

  useEffect(() => {
    fetchRecipes();
  }, [refreshKey]);

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="text-gray-600 hover:text-rose-500 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
          <Link
            to="/add-recipe"
            className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
          >
            Add New Recipe
          </Link>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No recipes found. Be the first to add a recipe!</p>
          <Link
            to="/add-recipe"
            className="mt-4 inline-block bg-rose-500 text-white px-6 py-3 rounded-md hover:bg-rose-600"
          >
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <div 
                className="relative h-48"
                onClick={() => handleRecipeClick(recipe.id)}
              >
                <img
                  src={getImageSrc(recipe.image)}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/default-recipe-image.jpg';
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
                  <div className="p-4 text-white">
                    <h2 className="text-xl font-semibold">{recipe.title}</h2>
                    <p className="text-sm">By {recipe.author}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={(e) => handleLike(e, recipe.id)}
                    className="flex items-center space-x-2 group"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 ${recipe.isLiked ? 'text-rose-500 fill-current' : 'text-gray-400 group-hover:text-rose-500'}`}
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      fill={recipe.isLiked ? "currentColor" : "none"}
                      strokeWidth={recipe.isLiked ? "0" : "2"}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                    <span className="text-gray-600">{recipe.likes || 0} likes</span>
                  </button>
                  <span className="text-sm text-gray-500">
                    {(recipe.prepTime || 0) + (recipe.cookTime || 0)} mins
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-2">{recipe.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recipe.cuisine && (
                    <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm">
                      {recipe.cuisine}
                    </span>
                  )}
                  {recipe.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;