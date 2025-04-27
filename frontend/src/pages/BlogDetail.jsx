import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated, user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('Fetching blog with ID:', id);
        
        // First fetch the blog
        const blogResponse = await fetch(`http://localhost:8080/api/blogs/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });

        console.log('Response status:', blogResponse.status);
        
        if (!blogResponse.ok) {
          if (blogResponse.status === 404) {
            throw new Error('Blog not found');
          }
          const errorText = await blogResponse.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch blog: ${blogResponse.statusText}`);
        }

        const blogData = await blogResponse.json();
        console.log('Complete blog data:', blogData);
        
        // Then fetch the user information if we have a userId
        if (blogData.userId || blogData.user_id || blogData.author || blogData.createdBy) {
          const userIdToFetch = blogData.userId || blogData.user_id || blogData.author || blogData.createdBy;
          const userResponse = await fetch(`http://localhost:8080/api/users/${userIdToFetch}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` })
            }
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            blogData.user = userData;
          }
        }

        console.log('Complete blog data after user fetch:', blogData);
        console.log('Current user data:', user);

        setBlog(blogData);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(error.message);
        toast.error('Failed to load blog post');
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setError('No blog ID provided');
      setLoading(false);
    }
  }, [id, token, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="mt-4">
            <Link
              to="/blogs"
              className="text-blue-500 hover:text-blue-700 font-medium inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist or has been removed.</p>
          <div className="mt-4">
            <Link
              to="/blogs"
              className="text-blue-500 hover:text-blue-700 font-medium inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Debug logs
  console.log('Current User:', {
    id: user?.id,
    name: user?.name,
    isAuthenticated: isAuthenticated
  });
  console.log('Complete Blog Data:', blog);
  console.log('Blog Author Info:', {
    id: blog?.id,
    userId: blog?.userId,
    user_id: blog?.user_id,
    author: blog?.author,
    createdBy: blog?.createdBy,
    user: blog?.user
  });

  // Improved author check - check all possible fields
  const isAuthor = isAuthenticated && user?.id && (
    blog?.userId === user?.id || 
    blog?.user_id === user?.id || 
    blog?.author === user?.id ||
    blog?.createdBy === user?.id ||
    blog?.user?.id === user?.id
  );

  console.log('Is Author Check:', {
    isAuthenticated,
    userId: user?.id,
    matches: {
      userId: blog?.userId === user?.id,
      user_id: blog?.user_id === user?.id,
      author: blog?.author === user?.id,
      createdBy: blog?.createdBy === user?.id,
      userDotId: blog?.user?.id === user?.id
    },
    finalResult: isAuthor
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center justify-between mb-8">
          <Link
            to="/blogs"
            className="text-blue-500 hover:text-blue-700 font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Link>
          {isAuthenticated && (
            <div className="flex space-x-4">
              {isAuthor && (
                <>
                  <Link
                    to={`/blogs/${id}/edit`}
                    className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
                  >
                    Edit Blog
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete Blog
                  </button>
                </>
              )}
            </div>
          )}
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span className="font-medium">
              By {blog.user?.name || blog.user?.displayName || blog.user?.fullName || user?.name || 'Anonymous'}
              {isAuthor && ' (You)'}
            </span>
            <span className="mx-2">•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
              <>
                <span className="mx-2">•</span>
                <span>Updated: {new Date(blog.updatedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        {blog.imageUrl && (
          <div className="mb-8">
            <img
              src={blog.imageUrl.startsWith('http') ? blog.imageUrl : `http://localhost:8080/${blog.imageUrl}`}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/default-recipe-image.png';
              }}
            />
          </div>
        )}

        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{blog.content}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;