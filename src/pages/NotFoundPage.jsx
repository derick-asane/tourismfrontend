import React, { useState, useEffect } from "react";
import {
  Home,
  Search,
  MapPin,
  Plane,
  Compass,
  Mountain,
  TreePine,
  Waves,
  Sun,
  Cloud,
  Star,
  ArrowRight,
  RefreshCw,
  Mail,
} from "lucide-react";

const NotFoundPage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const travelTips = [
    "Try searching for popular destinations like Bali, Paris, or Tokyo",
    "Check out our trending travel packages this month",
    "Browse our curated list of hidden gems around the world",
    "Don't forget to sign up for exclusive travel deals",
  ];

  const popularDestinations = [
    { name: "Santorini", country: "Greece", icon: Sun },
    { name: "Bali", country: "Indonesia", icon: TreePine },
    { name: "Swiss Alps", country: "Switzerland", icon: Mountain },
    { name: "Maldives", country: "Indian Ocean", icon: Waves },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % travelTips.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 opacity-10">
          <Plane className="h-24 w-24 text-blue-600 animate-pulse" />
        </div>
        <div className="absolute top-1/4 right-20 opacity-10">
          <Mountain className="h-32 w-32 text-green-600" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-10">
          <Waves className="h-28 w-28 text-blue-500 animate-bounce" />
        </div>
        <div className="absolute top-1/3 left-1/3 opacity-5">
          <Sun className="h-40 w-40 text-yellow-500" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 opacity-10">
          <TreePine className="h-36 w-36 text-green-500" />
        </div>
        <div className="absolute top-1/2 right-10 opacity-10">
          <Cloud className="h-20 w-20 text-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div
              className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-4 ${
                isAnimating ? "animate-pulse" : ""
              }`}
            >
              404
            </div>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div
                className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Oops! Looks Like You're
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Off The Map
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Don't worry, even the best explorers take a wrong turn sometimes.
              Let's get you back on track to your next amazing adventure!
            </p>

            {/* Travel Tip */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-white/20 shadow-lg">
              <div className="flex items-center justify-center mb-3">
                <Compass className="h-5 w-5 text-amber-500 mr-2" />
                <span className="font-semibold text-gray-700">Travel Tip</span>
              </div>
              <p className="text-gray-600 transition-all duration-500">
                {travelTips[currentTip]}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center">
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Back to Home
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleRefresh}
              className="group bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
            >
              <RefreshCw
                className={`mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500 ${
                  isAnimating ? "animate-spin" : ""
                }`}
              />
              Try Again
            </button>

            <button className="group bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center">
              <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Search Destinations
            </button>
          </div>

          {/* Popular Destinations */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Or Explore These Popular Destinations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularDestinations.map((destination, index) => (
                <div
                  key={index}
                  className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer border border-white/20"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <destination.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {destination.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {destination.country}
                    </p>
                    <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">4.9</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20 shadow-lg mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations, hotels, activities..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                Search
              </button>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Still having trouble? Our support team is here to help!
            </p>
            <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default NotFoundPage;
