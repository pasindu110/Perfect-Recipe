import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/config';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { user, token, refreshToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    // Pre-fill form with user data from context
    Object.keys(user).forEach(key => {
      setValue(key, user[key]);
    });
  }, [user, token, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
      } else if (response.status === 403) {
        // Try to refresh token
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the update with new token
          const newToken = localStorage.getItem('token');
          const retryResponse = await fetch(`${API_URL}/api/users/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`
            },
            body: JSON.stringify(data)
          });

          if (retryResponse.ok) {
            const updatedUser = await retryResponse.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast.success('Profile updated successfully');
          } else {
            throw new Error('Failed to update profile after token refresh');
          }
        } else {
          throw new Error('Session expired. Please login again.');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message);
      if (error.message.includes('session') || error.message.includes('login')) {
        await logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordChange = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success('Password updated successfully');
      } else if (response.status === 403) {
        // Try to refresh token
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry the password change with new token
          const newToken = localStorage.getItem('token');
          const retryResponse = await fetch(`${API_URL}/api/users/password`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`
            },
            body: JSON.stringify(data)
          });

          if (retryResponse.ok) {
            toast.success('Password updated successfully');
          } else {
            throw new Error('Failed to update password after token refresh');
          }
        } else {
          throw new Error('Session expired. Please login again.');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message);
      if (error.message.includes('session') || error.message.includes('login')) {
        await logout();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Account Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Account Setting</h2>
          <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Display name</label>
              <input
                type="text"
                {...register('displayName', { required: 'Display name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                {...register('username')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Secondary Email</label>
              <input
                type="email"
                {...register('secondaryEmail')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                {...register('phoneNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country/Region</label>
              <select
                {...register('country')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              >
                <option value="">Select country</option>
                <option value="Bangladesh">Bangladesh</option>
                {/* Add more countries */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                {...register('state')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              >
                <option value="">Select state</option>
                <option value="Dhaka">Dhaka</option>
                {/* Add more states */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                {...register('zipCode')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
        {/* Change Password */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onPasswordChange)}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                {...register('currentPassword', { required: 'Current password is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                {...register('newPassword', { required: 'New password is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 