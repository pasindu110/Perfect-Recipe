import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/config';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

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

    const fetchComments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recipes/${id}/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (id) {
      fetchRecipe();
      fetchComments();
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        toast.success('Recipe deleted successfully');
        navigate('/recipes');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('An error occurred while deleting the recipe');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = () => {
    navigate(`/recipes/edit/${id}`);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to comment');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmittingComment(true);

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('authorName', user.fullName);
      formData.append('content', newComment);
      formData.append('rating', rating);

      const response = await fetch(`${API_URL}/api/recipes/${id}/comments`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newCommentData = await response.json();
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
      setRating(0);
      toast.success('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            {error || 'Recipe not found'}
          </h2>
          <p className="text-gray-600 mt-2">
            {error === 'Recipe not found' 
              ? "The recipe you're looking for might have been deleted or doesn't exist."
              : 'Please try again later.'}
          </p>
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

  const isAuthor = user && recipe.userId === user.id;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span>Recipe</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{recipe.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
          
          {/* Recipe Image and Time Info */}
          <div className="mb-8">
            <img
              src={getImageSrc(recipe.image)}
              alt={recipe.title}
              className="w-full h-96 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = '/default-recipe-image.jpg';
                e.target.onerror = null;
              }}
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-gray-500">Prep time</p>
                  <p className="font-semibold">{recipe.prepTime} mins</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Cook time</p>
                  <p className="font-semibold">{recipe.cookTime} mins</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Servings</p>
                  <p className="font-semibold">{recipe.servings}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {isAuthor && (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Edit Recipe
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Recipe'}
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <button className="text-primary hover:text-primary-dark">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <span className="text-gray-600">{recipe.likes || 0} likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Ingredients:</h2>
            <ul className="space-y-2">
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Instructions:</h2>
            <ol className="space-y-4">
              {recipe.instructions && recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="flex-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <div className="space-y-6">
              {/* Add comment form */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Rate this recipe and share your opinion</h3>
                <form onSubmit={handleSubmitComment}>
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts about this recipe..."
                    className="w-full p-3 border rounded-md"
                    rows="4"
                    required
                  ></textarea>
                  <button 
                    type="submit"
                    disabled={isSubmittingComment}
                    className="mt-4 bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition duration-300 disabled:opacity-50"
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              </div>

              {/* Comments list */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{comment.authorName}</h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 ${
                                index < comment.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;