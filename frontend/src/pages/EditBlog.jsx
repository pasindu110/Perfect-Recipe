import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to edit blog post');
      navigate('/login');
      return;
    }
    fetchBlog();
  }, [isAuthenticated, navigate, id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blog');
      }

      const data = await response.json();
      setFormData({
        title: data.title,
        content: data.content,
        image: null,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog post');
      navigate('/blogs');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`http://localhost:8080/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 403) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
          return;
        }
        throw new Error(errorData?.message || 'Failed to update blog');
      }

      toast.success('Blog updated successfully!');
      navigate('/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error.message || 'Failed to update blog. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 403) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
          return;
        }
        throw new Error(errorData?.message || 'Failed to delete blog');
      }

      toast.success('Blog deleted successfully!');
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.message || 'Failed to delete blog. Please try again.');
    }
  };

  if (!isAuthenticated || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete Blog
            </button>
            <div className="space-x-4">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
              >
                Update Blog
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;