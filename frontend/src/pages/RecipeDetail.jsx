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
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshToken, logout } = useAuth();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/api/recipes/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Recipe not found');
          }
          throw new Error('Failed to load recipe');
        }

        const data = await response.json();
        setRecipe(data);
        setIsLiked(data.likedByUsers?.includes(user?.id));
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(error.message);
        toast.error(error.message);
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
  }, [id, navigate, user]);

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
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to comment');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('authorName', user.fullName);
      formData.append('content', newComment);
      formData.append('rating', rating.toString());

      const response = await fetch(`${API_URL}/api/recipes/${id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 403) {
          // Try to refresh token
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Retry the comment submission with new token
            const newToken = localStorage.getItem('token');
            const retryResponse = await fetch(`${API_URL}/api/recipes/${id}/comments`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${newToken}`
              },
              body: formData
            });

            if (retryResponse.ok) {
              const newCommentData = await retryResponse.json();
              setComments(prev => [newCommentData, ...prev]);
              setNewComment('');
              setRating(0);
              toast.success('Comment posted successfully!');
              return;
            }
          }
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to post comment');
      }

      const newCommentData = await response.json();
      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
      setRating(0);
      toast.success('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error(error.message);
      if (error.message.includes('session') || error.message.includes('login')) {
        await logout();
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async () => {
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

      const response = await fetch(`${API_URL}/api/recipes/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const updatedRecipe = await response.json();
        setRecipe(updatedRecipe);
        const newIsLiked = updatedRecipe.likedByUsers?.includes(user.id) || false;
        setIsLiked(newIsLiked);
        toast.success(newIsLiked ? 'Recipe liked!' : 'Like removed!');
      } else {
        throw new Error('Failed to like recipe');
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
      toast.error('Failed to like recipe. Please try again.');
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!user) {
      toast.error('Please log in to update comments');
      navigate('/login');
      return;
    }

    if (!editContent.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (editRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update comments');
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('content', editContent);
      formData.append('rating', editRating);

      const response = await fetch(`${API_URL}/api/recipes/${id}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 403) {
          toast.error('You are not authorized to update this comment');
          return;
        }
        throw new Error('Failed to update comment');
      }

      const updatedComment = await response.json();
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
      setEditingComment(null);
      setEditContent('');
      setEditRating(0);
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      toast.error('Please log in to delete comments');
      navigate('/login');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to delete comments');
        navigate('/login');
        return;
      }

      // Find the comment to verify ownership before attempting deletion
      const commentToDelete = comments.find(c => c.id === commentId);
      if (!commentToDelete) {
        toast.error('Comment not found');
        return;
      }

      console.log('\nAttempting to delete comment:');
      console.log('Comment details:');
      console.log('- Comment ID:', commentId);
      console.log('- Comment user ID:', commentToDelete.userId);
      console.log('- Comment author:', commentToDelete.authorName);
      
      console.log('\nAuthenticated user details:');
      console.log('- User ID:', user.id);
      console.log('- User email:', user.email);
      console.log('- User full name:', user.fullName);
      console.log('- Token:', token);

      console.log('\nOwnership check:');
      console.log('- Comment user ID matches current user ID?', commentToDelete.userId === user.id);

      const response = await fetch(`${API_URL}/api/recipes/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      let responseText;
      try {
        responseText = await response.text();
        console.log('\nServer response:');
        console.log('- Status:', response.status);
        console.log('- Response:', responseText);
      } catch (e) {
        console.log('Could not get response text:', e);
      }

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Please log in again');
          navigate('/login');
          return;
        }
        if (response.status === 403) {
          console.error('Authorization failed. Server response:', responseText);
          toast.error('You can only delete your own comments');
          return;
        }
        throw new Error(responseText || 'Failed to delete comment');
      }

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.message || 'Failed to delete comment');
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

  // Helper to extract YouTube video ID
  const extractYouTubeId = (url) => {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  };

  console.log('Recipe object:', recipe);

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
                  <button 
                    onClick={handleLike}
                    className="text-primary hover:text-primary-dark"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 ${isLiked ? 'text-rose-500 fill-current' : 'text-gray-400 hover:text-rose-500'}`}
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      fill={isLiked ? "currentColor" : "none"}
                      strokeWidth={isLiked ? "0" : "2"}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                  </button>
                  <span className="text-gray-600">{recipe?.likes || 0} likes</span>
                </div>
              </div>
            </div>
          </div>
                {/* Video Section */}
                            {recipe.videoUrl && (
                              <section className="mb-8">
                                <h2 className="text-2xl font-bold mb-2">Video</h2>
                                {extractYouTubeId(recipe.videoUrl) ? (
                                  <iframe
                                    width="480"
                                    height="270"
                                    src={`https://www.youtube.com/embed/${extractYouTubeId(recipe.videoUrl)}`}
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    title="Recipe video"
                                    className="rounded"
                                  />
                                ) : (
                                  <video
                                    src={`http://localhost:8080${recipe.videoUrl}`}
                                    controls
                                    width="480"
                                    height="270"
                                    className="rounded"
                                  />
                                )}
                              </section>
                            )}
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
                    {editingComment === comment.id ? (
                      <div className="space-y-4">
                        <div className="flex items-center mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditRating(star)}
                              className={star <= editRating ? "text-yellow-400" : "text-gray-300"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-3 border rounded-md"
                          rows="4"
                        ></textarea>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditContent('');
                              setEditRating(0);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
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
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            {user && user.id === comment.userId && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingComment(comment.id);
                                    setEditContent(comment.content);
                                    setEditRating(comment.rating);
                                  }}
                                  className="text-blue-500 hover:text-blue-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600">{comment.content}</p>
                      </>
                    )}
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