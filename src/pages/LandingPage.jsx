import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Calendar,
  Users,
  Camera,
  ArrowRight,
  Search,
  Heart,
  Award,
  Compass,
  Sunset,
  Waves,
  Mountain,
  TreePine,
  Building2,
  Plane,
  Clock,
  Shield,
  Globe2,
} from "lucide-react";
import {Link} from "react-router-dom"
const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchType, setSearchType] = useState("destination");

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920",
      title: "Explore Paradise",
      subtitle: "Discover hidden gems around Cameroon",
    },
    {
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920",
      title: "Mountain Adventures",
      subtitle: "Conquer peaks and embrace nature",
    },
    {
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920",
      title: "Ocean Escapes",
      subtitle: "Dive into crystal clear waters",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredDestinations = [
    {
      id: 1,
      name: "Tokyo, Japan",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500",
      price: "$2,199",
      duration: "7 days",
      rating: 4.9,
      reviews: 1247,
      type: "Cultural",
    },
    {
      id: 2,
      name: "Maldives",
      country: "Indian Ocean",
      image:
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500",
      price: "$3,599",
      duration: "5 days",
      rating: 5.0,
      reviews: 892,
      type: "Beach",
    },
    {
      id: 3,
      name: "Swiss Alps",
      country: "Switzerland",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500",
      price: "$1,899",
      duration: "6 days",
      rating: 4.8,
      reviews: 2156,
      type: "Adventure",
    },
    {
      id: 4,
      name: "Santorini",
      country: "Greece",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500",
      price: "$1,649",
      duration: "4 days",
      rating: 4.9,
      reviews: 1834,
      type: "Romance",
    },
  ];

  const experiences = [
    {
      icon: Sunset,
      title: "Sunset Views",
      description:
        "Watch magical sunsets from the world's most beautiful locations",
      color: "from-orange-400 to-pink-500",
    },
    {
      icon: Waves,
      title: "Ocean Adventures",
      description: "Dive, surf, and explore the mysteries of the deep blue sea",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Mountain,
      title: "Mountain Climbing",
      description:
        "Scale majestic peaks and witness breathtaking panoramic views",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Building2,
      title: "City Exploration",
      description: "Immerse yourself in vibrant cultures and urban landscapes",
      color: "from-purple-400 to-indigo-500",
    },
  ];

  const stats = [
    { number: "150K+", label: "Happy Travelers", icon: Users },
    { number: "200+", label: "Destinations", icon: MapPin },
    { number: "50+", label: "Countries", icon: Globe2 },
    { number: "24/7", label: "Support", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Slideshow */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%), url('${slide.image}')`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="text-white space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Compass className="h-6 w-6 text-amber-400" />
                    <span className="text-amber-400 font-semibold tracking-wide uppercase text-sm">
                      Adventure Awaits
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-lg">
                    {heroSlides[currentSlide].subtitle}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/login" className="group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                    <Camera className="mr-2 h-5 w-5" />
                    View Gallery
                  </button>
                </div>

                {/* Slide Indicators */}
                <div className="flex space-x-3">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-12 h-1 rounded-full transition-all duration-300 ${
                        index === currentSlide ? "bg-amber-400" : "bg-white/30"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Right Side - Search Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Plan Your Perfect Trip
                </h3>

                {/* Search Type Tabs */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                  <button
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      searchType === "destination"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setSearchType("destination")}
                  >
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Destination
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      searchType === "experience"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setSearchType("experience")}
                  >
                    <Heart className="h-4 w-4 inline mr-2" />
                    Experience
                  </button>
                </div>

                {/* Search Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Where do you want to go?
                    </label>
                    <input
                      type="text"
                      placeholder="Enter destination..."
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Travelers
                    </label>
                    <select className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all">
                      <option>1 Adult</option>
                      <option>2 Adults</option>
                      <option>2 Adults, 1 Child</option>
                      <option>Family (4+)</option>
                    </select>
                  </div>

                  <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center">
                    <Search className="mr-2 h-5 w-5" />
                    Search Adventures
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <stat.icon className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                  <div className="text-3xl font-black text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-semibold">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold mb-4">
              <Award className="h-4 w-4 mr-2" />
              Top Rated Destinations
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular destinations chosen by our community of
              travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {destination.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="bg-white/20 backdrop-blur p-2 rounded-full hover:bg-white/30 transition-colors">
                      <Heart className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {destination.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {destination.country}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-gray-900">
                            {destination.price}
                          </div>
                          <div className="text-xs text-gray-600">
                            {destination.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-400 fill-current" />
                          <span className="ml-1 text-sm font-semibold text-gray-900">
                            {destination.rating}
                          </span>
                          <span className="ml-1 text-xs text-gray-600">
                            ({destination.reviews})
                          </span>
                        </div>
                        <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Types */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Choose Your Adventure
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From serene beaches to thrilling mountain peaks, find your perfect
              escape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((experience, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer rounded-3xl overflow-hidden p-8 bg-gradient-to-br ${experience.color} hover:scale-105 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10">
                  <experience.icon className="h-12 w-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {experience.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {experience.description}
                  </p>
                  <div className="mt-4 flex items-center text-white">
                    <span className="font-semibold">Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Plane className="h-16 w-16 mx-auto mb-8 text-white/80" />
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Your Adventure Starts Here
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join millions of travelers who have discovered their perfect getaway
            with us
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              Start Planning Today
            </button>
            <button className="border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
              Browse Destinations
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              <span>Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
