import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

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
            <Link to="/challenges" className="text-gray-600 hover:text-rose-500">Challenges</Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
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