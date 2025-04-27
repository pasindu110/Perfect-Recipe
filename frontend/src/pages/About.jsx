import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUsers, FaStar, FaUtensils, FaSearch, FaHeart } from 'react-icons/fa';
import { API_URL } from '../config/config';

const About = () => {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/about`);
        setAboutInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load about information. Please try again later.');
        setLoading(false);
        console.error('Error fetching about info:', err);
      }
    };

    fetchAboutInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About {aboutInfo?.name}</h1>
        <p className="text-xl text-gray-700">{aboutInfo?.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 mb-6">{aboutInfo?.mission}</p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {aboutInfo?.features.map((feature, index) => (
            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                {index === 0 && <FaUtensils className="text-rose-500 text-2xl" />}
                {index === 1 && <FaUsers className="text-rose-500 text-2xl" />}
                {index === 2 && <FaStar className="text-rose-500 text-2xl" />}
                {index === 3 && <FaSearch className="text-rose-500 text-2xl" />}
              </div>
              <span className="ml-4 text-gray-700 text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aboutInfo?.team && Object.entries(aboutInfo.team).map(([role, name]) => (
            <div key={role} className="flex items-center p-6 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                <FaUsers className="text-rose-500 text-2xl" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-lg">{name}</h3>
                <p className="text-rose-500 capitalize">{role.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Us</h2>
        <div className="space-y-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <FaEnvelope className="text-rose-500 text-2xl" />
            <span className="ml-4 text-gray-700 text-lg">{aboutInfo?.contact?.email}</span>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <FaPhone className="text-rose-500 text-2xl" />
            <span className="ml-4 text-gray-700 text-lg">{aboutInfo?.contact?.phone}</span>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <FaMapMarkerAlt className="text-rose-500 text-2xl" />
            <span className="ml-4 text-gray-700 text-lg">{aboutInfo?.contact?.address}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600 text-base pb-8">
        <p>Version {aboutInfo?.version}</p>
        <p className="mt-2">Made with <FaHeart className="inline text-rose-500" /> by the {aboutInfo?.name} Team</p>
      </div>
    </div>
  );
};

export default About; 