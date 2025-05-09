import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/config';

const AddRecipe = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipeImage, setRecipeImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [recipeVideo, setRecipeVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoType, setVideoType] = useState('file'); // 'file' or 'youtube'
  const [youtubeLink, setYoutubeLink] = useState('');
  const navigate = useNavigate();
  const { user, logout, refreshToken } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      prepTime: '',
      cookTime: '',
      servings: '',
      cuisine: 'Italian',
      ingredients: [''],
      instructions: [''],
      nutritionFacts: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      }
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecipeImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    let currentToken = localStorage.getItem('token');
    
    try {
      if (!currentToken) {
        toast.error('Please log in to add a recipe');
        logout();
        return;
      }

      const formData = new FormData();
      
      // Add basic recipe data
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('prepTime', data.prepTime);
      formData.append('cookTime', data.cookTime);
      formData.append('servings', data.servings);
      formData.append('cuisine', data.cuisine);

      // Handle ingredients and instructions as arrays
      formData.append('ingredients', JSON.stringify(data.ingredients.filter(item => item.trim() !== '')));
      formData.append('instructions', JSON.stringify(data.instructions.filter(item => item.trim() !== '')));

      // Handle nutrition facts
      if (data.nutritionFacts) {
        formData.append('nutritionFacts', JSON.stringify(data.nutritionFacts));
      }

      // Handle image
      if (recipeImage && recipeImage instanceof File) {
        formData.append('image', recipeImage);
      }

      // Handle video
      if (videoType === 'file' && recipeVideo) {
        formData.append('video', recipeVideo);
      }
      if (videoType === 'youtube' && youtubeLink) {
        formData.append('videoUrl', youtubeLink);
      }

      // Add user information
      if (!user || !user.id || !user.fullName) {
        throw new Error('User information is missing');
      }
      formData.append('userId', user.id);
      formData.append('author', user.fullName);

      const makeRequest = async (token) => {
        const response = await fetch(`${API_URL}/api/recipes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          if (response.status === 403) {
            throw new Error('TOKEN_EXPIRED');
          }
          throw new Error(errorText || `Request failed with status ${response.status}`);
        }

        return response;
      };

      try {
        // First attempt with current token
        await makeRequest(currentToken);
        toast.success('Recipe added successfully!');
        navigate('/recipes');
      } catch (error) {
        console.error('Error details:', error);
        if (error.message === 'TOKEN_EXPIRED') {
          try {
            // Try to refresh the token
            const newToken = await refreshToken();
            if (!newToken) {
              throw new Error('Token refresh failed');
            }
            
            // Retry with new token
            await makeRequest(newToken);
            toast.success('Recipe added successfully!');
            navigate('/recipes');
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            toast.error('Your session has expired. Please log in again.');
            logout();
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      if (error.message.includes('User information is missing')) {
        toast.error('Please log in again to add a recipe');
        logout();
      } else if (!error.message.includes('TOKEN_EXPIRED')) {
        toast.error(error.message || 'Failed to create recipe. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span>Recipe</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Create new recipe</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create new recipe</h1>

          {/* Recipe Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title:
            </label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="w-full p-3 border rounded-md"
              placeholder="Black Bean & Corn Quesadillas"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Recipe Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe image:
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      className="mx-auto h-64 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setRecipeImage(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recipe Video */}
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
                {videoPreview && (
                  <video
                    src={videoPreview}
                    controls
                    width="320"
                    height="180"
                    className="mt-2 rounded"
                  />
                )}
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

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description:
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows="4"
              className="w-full p-3 border rounded-md"
              placeholder="Introduce your recipe"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Time and Servings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time (minutes):
              </label>
              <input
                type="number"
                {...register('prepTime', { required: 'Prep time is required' })}
                className="w-full p-3 border rounded-md"
                placeholder="30"
              />
              {errors.prepTime && (
                <p className="mt-1 text-sm text-red-600">{errors.prepTime.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cook Time (minutes):
              </label>
              <input
                type="number"
                {...register('cookTime', { required: 'Cook time is required' })}
                className="w-full p-3 border rounded-md"
                placeholder="20"
              />
              {errors.cookTime && (
                <p className="mt-1 text-sm text-red-600">{errors.cookTime.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servings:
              </label>
              <input
                type="number"
                {...register('servings', { required: 'Number of servings is required' })}
                className="w-full p-3 border rounded-md"
                placeholder="4"
              />
              {errors.servings && (
                <p className="mt-1 text-sm text-red-600">{errors.servings.message}</p>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients:
            </label>
            <div className="space-y-2">
              {watch('ingredients').map((_, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    {...register(`ingredients.${index}`, { required: 'Ingredient is required' })}
                    className="flex-1 p-3 border rounded-md"
                    placeholder="1 x 15 oz can black beans"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const ingredients = watch('ingredients');
                        ingredients.splice(index, 1);
                        // Update form state
                      }}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const ingredients = watch('ingredients');
                  ingredients.push('');
                  // Update form state
                }}
                className="mt-2 text-sm text-primary hover:text-primary-dark"
              >
                + Add ingredient
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions:
            </label>
            <div className="space-y-2">
              {watch('instructions').map((_, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <textarea
                      {...register(`instructions.${index}`, { required: 'Instruction is required' })}
                      className="w-full p-3 border rounded-md"
                      rows="2"
                      placeholder="Write instruction"
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const instructions = watch('instructions');
                        instructions.splice(index, 1);
                        // Update form state
                      }}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const instructions = watch('instructions');
                  instructions.push('');
                  // Update form state
                }}
                className="mt-2 text-sm text-primary hover:text-primary-dark"
              >
                + Add instruction
              </button>
            </div>
          </div>

          {/* Cuisine */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine:
            </label>
            <select
              {...register('cuisine', { required: 'Cuisine is required' })}
              className="w-full p-3 border rounded-md"
            >
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="Chinese">Chinese</option>
              <option value="Indian">Indian</option>
              <option value="Japanese">Japanese</option>
              <option value="Thai">Thai</option>
              <option value="French">French</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="American">American</option>
              <option value="Other">Other</option>
            </select>
            {errors.cuisine && (
              <p className="mt-1 text-sm text-red-600">{errors.cuisine.message}</p>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? 'Posting Recipe...' : 'Post Recipe'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;