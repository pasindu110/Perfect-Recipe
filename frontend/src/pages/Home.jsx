import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

const chefAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';
const heroFoodImg = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
const shareRecipeImg = 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80';

const Home = () => {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [exploreRecipes, setExploreRecipes] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Mock data for trending recipes
    const mockTrendingRecipes = [
      {
        id: 1,
        title: 'Onion Rings',
        image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 122,
        views: 1.2,
      },
      {
        id: 2,
        title: 'Toast with Tomato, Green & Hummus',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 98,
        views: 1.1,
      },
      {
        id: 3,
        title: 'Ham, Egg, and Spinach Rollups',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 115,
        views: 1.5,
      },
      {
        id: 4,
        title: 'Chicken Ranch Wrap',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 104,
        views: 1.3,
      },
      {
        id: 5,
        title: 'Tuna Mayo Tuna Salad',
        image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 99,
        views: 1.0,
      },
      {
        id: 6,
        title: 'Strawberry and Cherry Pancake',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 123,
        views: 2.3,
      },
    ];

    const mockExploreRecipes = [
      {
        id: 1,
        title: 'Green Goddess Wrap in a Light & Simple',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 101,
        views: 1.0,
      },
      {
        id: 2,
        title: 'Strawberry and Walnut Spinach Salad',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 98,
        views: 2.6,
      },
      {
        id: 3,
        title: 'Caprese California Pizza Kitchen BBQ Chicken',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 97,
        views: 2.1,
      },
      {
        id: 4,
        title: 'Cherry-Berry Smoothie Bowl',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 102,
        views: 1.4,
      },
      {
        id: 5,
        title: 'Green Smoothie',
        image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 99,
        views: 1.2,
      },
      {
        id: 6,
        title: 'Grilled Red Snapper',
        image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80',
        author: 'Alex Martin',
        likes: 105,
        views: 2.0,
      },
    ];

    const mockBlogPosts = [
      {
        id: 1,
        title: 'Unlocking the Benefits of Intermittent Fasting for Health',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
        excerpt: 'Learn about the science-backed benefits of this popular eating pattern.'
      },
      {
        id: 2,
        title: 'The Impact of Sugar Consumption on Your Health',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        excerpt: 'Discover how sugar affects your body and mind.'
      }
    ];

    setTrendingRecipes(mockTrendingRecipes);
    setExploreRecipes(mockExploreRecipes);
    setBlogPosts(mockBlogPosts);
  }, []);

  const categories = [
    { name: 'Breakfast recipes', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80' },
    { name: 'Lunch recipes', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80' },
    { name: 'Dinner recipes', image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Appetizer recipes', image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=200&q=80' },
    { name: 'Salad recipes', image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Pizza recipes', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=200&q=80' },
    { name: 'Smoothie recipes', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80' },
    { name: 'Pasta recipes', image: 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-[#FFF6F3] rounded-b-[60px] pt-16 pb-8 px-4 md:px-0 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-5xl font-bold leading-tight">
              Your Daily Dish<br />
              <span className="text-rose-600">A Food Journey</span>
            </h1>
            <p className="text-gray-600 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae enim pharetra, venenatis nunc eget, finibus est. Proin velit.
            </p>
            <button className="bg-rose-600 text-white px-8 py-3 rounded-full w-max hover:bg-rose-700 transition shadow">
              See Our Blogs 
            </button>
            <div className="flex items-center gap-3 mt-2">
              <img src={chefAvatar} alt="Chef" className="w-12 h-12 rounded-full border-2 border-white shadow" />
              <div className="bg-white rounded-xl px-4 py-2 shadow text-sm">
                <b>Sarah Johnson</b><br />
                Chef, sharing the best healthy recipes daily.
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center relative">
            <img src={heroFoodImg} alt="Hero Food" className="w-[340px] h-[340px] rounded-full object-cover shadow-lg border-8 border-white" />
            <span className="absolute top-8 right-8 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center rotate-12">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
            </span>
            <span className="absolute bottom-8 left-8 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center -rotate-12">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
            </span>
          </div>
        </div>
      </section>

      {/* Share Your Recipes Section */}
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 py-12">
        <div className="flex-1 flex justify-center">
          <div className="relative w-[340px] h-[340px]">
            <img src={chefAvatar} alt="Chef" className="rounded-2xl w-[260px] h-[260px] object-cover shadow-lg absolute left-0 top-10 z-10 border-4 border-white" />
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80" alt="Share recipe 2" className="rounded-2xl w-[180px] h-[180px] object-cover shadow-lg absolute right-0 top-0 z-20 border-4 border-white" />
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80" alt="Share recipe 3" className="rounded-2xl w-[120px] h-[120px] object-cover shadow-lg absolute left-10 bottom-0 z-30 border-4 border-white" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-4">
            Share Your <span className="text-rose-600">Recipes</span>
          </h2>
          <p className="text-gray-600 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae enim pharetra, venenatis nunc eget, finibus est. Proin velit.
          </p>
          <Link
            to="/add-recipe"
            className="bg-rose-600 text-white px-8 py-3 rounded-full inline-block hover:bg-rose-700 transition shadow"
          >
            Create New Recipe
          </Link>
        </div>
      </section>

      {/* Trending Recipes Section */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Trending Recipe</h2>
          <Link to="/recipes" className="text-rose-600 hover:text-rose-700">
            View more
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {trendingRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm overflow-hidden relative group">
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover group-hover:scale-105 transition" />
              <button className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition">
                <FaPlay className="text-rose-600" />
              </button>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{recipe.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1"><img src={chefAvatar} alt="Chef" className="w-5 h-5 rounded-full" /> {recipe.author}</span>
                  <span>{recipe.views}k views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Blog</h2>
          <Link to="/blog" className="text-rose-600 hover:text-rose-700">
            View more
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
                <p className="text-gray-600 flex-1">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Recipes Section */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Explore Recipes</h2>
          <Link to="/recipes" className="text-rose-600 hover:text-rose-700">
            View more
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {exploreRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm overflow-hidden relative group">
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover group-hover:scale-105 transition" />
              <button className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition">
                <FaPlay className="text-rose-600" />
              </button>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{recipe.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1"><img src={chefAvatar} alt="Chef" className="w-5 h-5 rounded-full" /> {recipe.author}</span>
                  <span>{recipe.views}k views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="text-center bg-[#FFF6F3] rounded-3xl p-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Let's Stay In Touch!</h2>
        <p className="text-gray-600 mb-8">
          Join our newsletter, so that we reach out to you with our news and offers.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter Your Email"
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-rose-600"
          />
          <button className="bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition">
            Subscribe
          </button>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link to="/categories" className="text-rose-600 hover:text-rose-700">
            View more
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
              className="group flex flex-col items-center"
            >
              <div className="relative w-28 h-28 mb-2">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-28 h-28 object-cover rounded-full border-4 border-white shadow group-hover:scale-110 transition duration-300"
                />
              </div>
              <span className="text-center text-gray-700 font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 border-t max-w-7xl mx-auto">
        <div className="flex justify-center items-center gap-16 opacity-50">
          <img src="/images/partner-nestle.png" alt="Nestle" className="h-8" />
          <img src="/images/partner-apple.png" alt="Apple" className="h-8" />
          <img src="/images/partner-amazon.png" alt="Amazon" className="h-8" />
          <img src="/images/partner-google.png" alt="Google" className="h-8" />
          <img src="/images/partner-walmart.png" alt="Walmart" className="h-8" />
        </div>
      </section>
    </div>
  );
};

export default Home; 