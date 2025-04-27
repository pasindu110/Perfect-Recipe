import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching all blogs...');
        const response = await fetch('http://localhost:8080/api/blogs', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch blogs');
        
        const data = await response.json();
        console.log('Received blogs:', data);
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-gray-600 mt-2">Read and share your thoughts</p>
        </div>
        {isAuthenticated && (
          <Link
            to="/add-blog"
            className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition duration-300 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Blog
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">No blogs available yet.</p>
            {isAuthenticated && (
              <p className="text-gray-500 mt-2">
                Be the first to create a blog post!
              </p>
            )}
          </div>
        ) : (
          blogs.map((blog) => {
            console.log('Blog ID:', blog.id, 'Title:', blog.title);
            return (
              <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                {blog.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={blog.imageUrl.startsWith('http') ? blog.imageUrl : `http://localhost:8080/${blog.imageUrl}`}
                      alt={blog.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.src = '/default-recipe-image.png';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 hover:text-rose-500">
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-gray-500 text-sm mb-2">By {blog.user?.displayName || blog.user?.fullName || 'Anonymous'}</p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="text-rose-500 hover:text-rose-600 font-medium flex items-center"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <span className="text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Blogs;