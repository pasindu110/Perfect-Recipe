import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold">Perfect</span>
              <span className="text-xl font-semibold text-rose-500">Recipe</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-rose-500">Home</Link>
            <Link to="/recipes" className="text-gray-600 hover:text-rose-500">Recipe</Link>
            <Link to="/add-recipe" className="text-gray-600 hover:text-rose-500">Add Recipe</Link>
            <Link to="/about" className="text-gray-600 hover:text-rose-500">About Us</Link>
            <Link to="/blogs" className="text-gray-600 hover:text-rose-500">Blogs</Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative text-gray-600 hover:text-rose-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-rose-500">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-rose-500 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 