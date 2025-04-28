import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [exploreRecipes, setExploreRecipes] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    // Mock data for trending recipes
    const mockTrendingRecipes = [
      {
        id: 1,
        title: 'Toast with Tomato, Herbs & Manchego',
        image: '/images/20096.jpg',
        author: 'John Doe',
        likes: 120
      },
      {
        id: 2,
        title: 'Herb, Egg, and Spinach Rollups',
        image: '/images/20096.jpg',
        author: 'Jane Smith',
        likes: 95
      },
      {
        id: 3,
        title: 'Garden Green Wrap',
        image: '/images/20096.jpg',
        author: 'Mike Johnson',
        likes: 85
      },
      // Add more mock recipes
    ];

    const mockExploreRecipes = [
      {
        id: 1,
        title: 'Korean Gochujang Wrap in a Light & Savory',
        image: '/images/20096.jpg',
        author: 'Sarah Lee'
      },
      {
        id: 2,
        title: 'Strawberry and Walnut Spinach Salad',
        image: '/images/20096.jpg',
        author: 'David Kim'
      },
      {
        id: 3,
        title: 'Oatmeal California Pizza from the Mill',
        image: '/images/20096.jpg',
        author: 'Emma Wilson'
      },
      // Add more explore recipes
    ];

    const mockBlogPosts = [
      {
        id: 1,
        title: 'Unlocking the Benefits of Intermittent Fasting',
        image: '/images/20096.jpg',
        excerpt: 'Learn about the science-backed benefits of this popular eating pattern.'
      },
      {
        id: 2,
        title: 'The Impact of Sugar Consumption on Your Health',
        image: '/images/20096.jpg',
        excerpt: 'Discover how sugar affects your body and mind.'
      }
    ];

    setTrendingRecipes(mockTrendingRecipes);
    setExploreRecipes(mockExploreRecipes);
    setBlogPosts(mockBlogPosts);
  }, []);

  const categories = [
    { name: 'Breakfast recipes', image: '/images/20096.jpg' },
    { name: 'Lunch recipes', image: '/images/20096.jpg' },
    { name: 'Dinner recipes', image: '/images/20096.jpg' },
    { name: 'Appetizer recipes', image: '/images/20096.jpg' },
    { name: 'Salad recipes', image: '/images/20096.jpg' },
    { name: 'Pizza recipes', image: '/images/20096.jpg' },
    { name: 'Smoothie recipes', image: '/images/20096.jpg' },
    { name: 'Pasta recipes', image: '/images/20096.jpg' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-white to-pink-50 rounded-3xl p-12">
        <div className="flex items-center justify-between">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-4">
              Your Daily Dish
              <br />
              <span className="text-rose-600">Food Journey</span>
            </h1>
            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae eros dolor amet.
              Nunc finibus elit in elit volutpat.
            </p>
            <button className="bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 transition">
              Get Started
            </button>
          </div>
          <div className="w-1/2">
            <img 
              src="/images/20096.jpg" 
              alt="Hero Image" 
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Share Your Recipes Section */}
      <section className="flex items-center justify-between gap-12">
        <div className="w-1/2">
          <img src="/images/20096.jpg" alt="Share recipe" className="rounded-2xl" />
        </div>
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-4">
            Share Your <span className="text-rose-600">Recipes</span>
          </h2>
          <p className="text-gray-600 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae eros dolor amet.
            Nunc finibus elit in elit volutpat.
          </p>
          <Link
            to="/add-recipe"
            className="bg-rose-600 text-white px-8 py-3 rounded-full inline-block hover:bg-rose-700 transition"
          >
            Share Now Recipe
          </Link>
        </div>
      </section>

      {/* Trending Recipes Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Trending Recipe</h2>
          <Link to="/recipes" className="text-rose-600 hover:text-rose-700">
            View more
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {trendingRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{recipe.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{recipe.author}</span>
                  <span>{recipe.likes} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Blog</h2>
          <Link to="/blog" className="text-rose-600 hover:text-rose-700">
            View more
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Recipes Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Explore Recipes</h2>
          <Link to="/recipes" className="text-rose-600 hover:text-rose-700">
            View more
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {exploreRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{recipe.title}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span>{recipe.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="text-center bg-gradient-to-r from-pink-50 to-white rounded-3xl p-12">
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
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link to="/categories" className="text-rose-600 hover:text-rose-700">
            View more
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
              className="group relative rounded-full overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white font-medium">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 border-t">
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