import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
<<<<<<< HEAD
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';
import RecipeList from './pages/RecipeList';
import Profile from './pages/Profile';
=======
import Profile from './pages/Profile';
import AddRecipe from './pages/AddRecipe';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';

// Blogs - Jayani
>>>>>>> origin/main
import Blogs from './pages/Blogs';
import AddBlog from './pages/AddBlog';
import BlogDetail from './pages/BlogDetail';
import EditBlog from './pages/EditBlog';
<<<<<<< HEAD
import About from './pages/About';
=======
>>>>>>> origin/main
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-center" />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD
=======
            <Route path="/profile" element={<Profile />} />
>>>>>>> origin/main
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/recipes/edit/:id" element={<EditRecipe />} />
<<<<<<< HEAD
            <Route path="/profile" element={<Profile />} />
=======


            {/* Blogs - Jayani */}
>>>>>>> origin/main
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/blogs/edit/:id" element={<EditBlog />} />
<<<<<<< HEAD
            <Route path="/about" element={<About />} />
=======
>>>>>>> origin/main
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
<<<<<<< HEAD

=======
>>>>>>> origin/main
export default App; 