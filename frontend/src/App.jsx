import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';
import RecipeList from './pages/RecipeList';
import Profile from './pages/Profile';
import Blogs from './pages/Blogs';
import AddBlog from './pages/AddBlog';
import BlogDetail from './pages/BlogDetail';
import EditBlog from './pages/EditBlog';
import About from './pages/About';
import Notifications from './pages/Notifications';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-center" />
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/add-recipe" element={<AddRecipe />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/recipes/edit/:id" element={<EditRecipe />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/add-blog" element={<AddBlog />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/blogs/:id/edit" element={<EditBlog />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App; 