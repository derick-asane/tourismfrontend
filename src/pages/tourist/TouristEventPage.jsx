import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Tag, // For event category
  Image, // Fallback icon for images
  X, // Close icon for modals
  ChevronLeft,
  ChevronRight, // For image gallery navigation
  BookOpen, // For Book Now button
  Plane, // General travel icon for Booking Modal header
  CheckCircle, // For success messages
  AlertCircle, // For error messages
  Filter, // For filter button
  Phone, // Added for mobile number field
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios"; // Ensure axios is imported

// Assuming BASE_URL is correctly defined and imported
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// --- Helper Functions ---
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins > 0 ? mins + "m" : ""}` : `${mins}m`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

// --- Mock Data (keep as is for context of event structure) ---
const mockEvents = [
  {
    id: "evt-001",
    title: "Historical City Walking Tour",
    description:
      "Discover the ancient secrets and vibrant history of the city's old quarter. Our expert guides will take you through hidden alleys and iconic landmarks.",
    price: 15.0,
    duration: 120,
    maxGroupSize: 15,
    createdAt: new Date("2024-01-10T09:00:00Z").toISOString(),
    touristicSiteId: "site-A",
    siteAdminId: "admin-X",
    images: [
      { id: "img-e1-1", url: "/uploads/events/city_tour_1.jpg" },
      { id: "img-e1-2", url: "/uploads/events/city_tour_2.jpg" },
      { id: "img-e1-3", url: "/uploads/events/city_tour_3.jpg" },
    ],
    touristicSite: {
      id: "site-A",
      name: "Old City District",
      location: "Fictional City, Country",
      category: "HISTORICAL",
      openingHours: "9:00 AM - 6:00 PM Daily",
      entryFee: 0,
    },
    guide: {
      id: "guide-1",
      user: { name: "Maria Guide" },
    },
  },
  {
    id: "evt-002",
    title: "Mountain Safari Adventure",
    description:
      "Embark on an exhilarating jeep safari through rugged mountain trails. Witness breathtaking views and unique wildlife.",
    price: 60.0,
    duration: 240,
    maxGroupSize: 8,
    createdAt: new Date("2024-01-15T14:30:00Z").toISOString(),
    touristicSiteId: "site-B",
    siteAdminId: "admin-Y",
    images: [
      { id: "img-e2-1", url: "/uploads/events/safari_1.jpg" },
      { id: "img-e2-2", url: "/uploads/events/safari_2.jpg" },
      { id: "img-e2-3", url: "/uploads/events/safari_3.jpg" },
      { id: "img-e2-4", url: "/uploads/events/safari_4.jpg" },
    ],
    touristicSite: {
      id: "site-B",
      name: "Grand Peak Reserve",
      location: "Highlands, Country",
      category: "ADVENTURE",
      openingHours: "7:00 AM - 5:00 PM Weekdays",
      entryFee: 10,
    },
    guide: {
      id: "guide-2",
      user: { name: "Alex Explorer" },
    },
  },
  {
    id: "evt-003",
    title: "Coastal Sunset Kayaking",
    description:
      "Paddle along the stunning coastline as the sun dips below the horizon. A serene and picturesque experience, suitable for all skill levels.",
    price: 30.0,
    duration: 90,
    maxGroupSize: 10,
    createdAt: new Date("2024-01-20T17:00:00Z").toISOString(),
    touristicSiteId: "site-C",
    siteAdminId: "admin-Z",
    images: [{ id: "img-e3-1", url: "/uploads/events/kayaking_1.jpg" }],
    touristicSite: {
      id: "site-C",
      name: "Emerald Bay",
      location: "Coastal Town, Country",
      category: "NATURAL",
      openingHours: "6:00 AM - 8:00 PM Daily",
      entryFee: 5,
    },
  },
  {
    id: "evt-004",
    title: "Local Cuisine Cooking Class",
    description:
      "Immerse yourself in local culture with a hands-on cooking class. Learn to prepare traditional dishes and enjoy your delicious creations.",
    price: 50.0,
    duration: 180,
    maxGroupSize: 6,
    createdAt: new Date("2024-01-25T10:00:00Z").toISOString(),
    touristicSiteId: "site-D",
    siteAdminId: "admin-X",
    images: [
      { id: "img-e4-1", url: "/uploads/events/cooking_class_1.jpg" },
      { id: "img-e4-2", url: "/uploads/events/cooking_class_2.jpg" },
      { id: "img-e4-3", url: "/uploads/events/cooking_class_3.jpg" },
    ],
    touristicSite: {
      id: "site-D",
      name: "Cultural Heritage Center",
      location: "Fictional City, Country",
      category: "CULTURAL",
      openingHours: "10:00 AM - 4:00 PM Mon-Sat",
      entryFee: 0,
    },
    guide: {
      id: "guide-3",
      user: { name: "Chef Laura" },
    },
  },
];

// --- Sub-Components ---

const ImageGalleryModal = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  eventTitle = "Event Images",
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const totalImages = images.length;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          title="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Main Image Display */}
        <div className="relative flex-grow flex items-center justify-center bg-black">
          {images.length > 0 ? (
            <img
              src={`${BASE_URL}${currentImage.url}`}
              alt={`${eventTitle} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-white text-lg flex flex-col items-center">
              <Image className="h-16 w-16 text-gray-500 mb-2" />
              No Images Available
            </div>
          )}

          {/* Navigation Arrows */}
          {totalImages > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors hidden md:block"
                title="Previous Image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors hidden md:block"
                title="Next Image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {totalImages > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {totalImages}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {totalImages > 1 && (
          <div className="flex-shrink-0 bg-gray-800 p-3 overflow-x-auto custom-scrollbar">
            <div className="flex justify-center space-x-2">
              {images.map((img, index) => (
                <img
                  key={img.id}
                  src={`${BASE_URL}${img.url}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-16 object-cover rounded-md cursor-pointer border-2 transition-all ${
                    index === currentIndex
                      ? "border-blue-500 scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event, onBookClick, onImageClick }) => {
  const [imageError, setImageError] = useState(false);
  const primaryImageUrl =
    event.images && event.images.length > 0
      ? `${BASE_URL}${event.images[0].url}`
      : null;

  const FallbackImage = () => (
    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
      <Image className="h-12 w-12 text-gray-400" />
      <span className="ml-2">No Image</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col">
      {/* Event Image - Clickable for gallery */}
      <div
        className="relative h-48 w-full overflow-hidden rounded-t-2xl cursor-pointer"
        onClick={() => onImageClick(event)} // Trigger image gallery on click
      >
        {imageError || !primaryImageUrl ? (
          <FallbackImage />
        ) : (
          <img
            src={primaryImageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        {event.images && event.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
            +{event.images.length - 1} photos
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-2xl font-bold text-blue-600 ml-4 flex-shrink-0">
            {formatPrice(event.price)}
          </p>
        </div>

        {/* Site Info & Category */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin size={16} className="text-purple-600 flex-shrink-0" />
          <span className="font-medium line-clamp-1">
            {event.touristicSite?.name || "N/A"}
          </span>
          <span className="text-gray-400">•</span>
          <Tag size={16} className="text-green-600 flex-shrink-0" />
          <span className="capitalize line-clamp-1">
            {event.touristicSite?.category || "N/A"}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {event.description}
        </p>

        {/* Event Details Grid */}
        <div className="grid grid-cols-2 gap-y-2 mb-4 text-gray-700 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-indigo-600 flex-shrink-0" />
            <span>{formatDuration(event.duration)}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
            <span>Max {event.maxGroupSize}</span>
          </div>
          <div className="flex items-center col-span-2">
            <Calendar className="h-4 w-4 mr-2 text-orange-600 flex-shrink-0" />
            <span className="line-clamp-1">
              {event.touristicSite?.openingHours || "N/A"}
            </span>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookClick(event);
            }} // Stop propagation to prevent image gallery from opening
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center group"
          >
            <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingModal = ({ isOpen, onClose, event, onConfirmBooking }) => {
  const [bookingDate, setBookingDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [mobileNumber, setMobileNumber] = useState(""); // New state for mobile number
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    // Reset form states when modal opens/closes
    if (isOpen) {
      setBookingDate("");
      setNumberOfPeople(1);
      setMobileNumber(""); // Reset mobile number
      setBookingError(null);
      setBookingSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const totalPrice = (event.price * numberOfPeople).toFixed(2);

  // --- New Function: handleBookingSubmit to backend ---
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    // Frontend validation
    if (
      !bookingDate ||
      numberOfPeople <= 0 ||
      numberOfPeople > event.maxGroupSize ||
      !mobileNumber ||
      !mobileNumber.match(/^\+?[0-9]{7,15}$/) // Basic phone number regex
    ) {
      setBookingError(
        "Please fill in all required fields correctly (date, number of people, valid mobile number)."
      );
      setBookingLoading(false);
      return;
    }

    // In a real application, you would get the touristId from your authentication context
    // For this example, let's assume a tourist object is stored in sessionStorage
    const authUser = JSON.parse(sessionStorage.getItem("user"));
    const touristId = authUser?.id; // Get ID from session storage

    if (!touristId) {
      setBookingError("You must be logged in to make a booking.");
      setBookingLoading(false);
      return;
    }

    const bookingPayload = {
      touristId: touristId,
      eventId: event.id,
      guideId: event.guide?.id || null, // Optional, can be null
      bookingDate: bookingDate,
      numberOfPeople: parseInt(numberOfPeople, 10),
      // Note: mobileNumber is collected here but your Booking model doesn't directly store it.
      // You might need to link it to the User's phoneNumber on the backend,
      // or add a phoneNumber field to the Booking model if you need it per booking.
      // For now, we'll send it, and your backend can decide what to do with it.
      phoneNumber: mobileNumber,
      totalPrice: parseFloat(totalPrice),
      status: "PENDING", // As per your Prisma schema default
    };

    console.log("Submitting booking payload:", bookingPayload);

    try {
      const response = await axios.post(
        `${BASE_URL}/bookings/create`,
        bookingPayload
      ); // Adjust API endpoint as needed
      const result = response.data;

      if (result.isOk) {
        // Assuming your backend responds with { isOk: true, ... }
        setBookingSuccess(
          `Booking for "${event.title}" on ${formatDate(
            bookingDate
          )} confirmed! Total: ${formatPrice(
            result.data.totalPrice || totalPrice
          )}.`
        );
        toast.success("Booking placed successfully!");
        onConfirmBooking(); // Callback to parent to close modal if needed
      } else {
        throw new Error(result.message || "Failed to place booking.");
      }
    } catch (err) {
      console.error("Booking API error:", err);
      setBookingError(
        err.response?.data?.message ||
          err.message ||
          "Failed to place booking. Please try again."
      );
      toast.error("Booking failed!");
    } finally {
      setBookingLoading(false);
    }
  };
  // --- End New Function ---

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-8 lg:p-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <Plane className="h-10 w-10 text-blue-600 mx-auto mb-3" />
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Book "{event.title}"
          </h3>
          <p className="text-gray-600">
            Confirm your details for an unforgettable experience.
          </p>
        </div>

        {bookingError && (
          <div className="flex items-center bg-red-100 text-red-800 p-3 rounded-lg mb-4">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{bookingError}</span>
          </div>
        )}
        {bookingSuccess && (
          <div className="flex items-center bg-green-100 text-green-800 p-3 rounded-lg mb-4">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="bookingDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Date *
            </label>
            <input
              type="date"
              id="bookingDate"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={today}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="numberOfPeople"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of People (Max: {event.maxGroupSize}) *
            </label>
            <input
              type="number"
              id="numberOfPeople"
              value={numberOfPeople}
              onChange={(e) =>
                setNumberOfPeople(
                  Math.max(
                    1,
                    Math.min(event.maxGroupSize, parseInt(e.target.value) || 1)
                  )
                )
              }
              min="1"
              max={event.maxGroupSize}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Mobile Number Field */}
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mobile Number (MOMO/OM) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel" // Use type="tel" for phone numbers
                id="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g., +1234567890"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
            <span className="text-lg font-semibold text-gray-800">
              Total Price:
            </span>
            <span className="text-2xl font-bold text-blue-700">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center group"
            disabled={bookingLoading}
          >
            {bookingLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-3"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <CheckCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
            {bookingLoading ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Tourist Events Page ---
const TouristEventPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
    minDuration: "",
    location: "",
  });

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);

  // State for image gallery
  const [showImageGalleryModal, setShowImageGalleryModal] = useState(false);
  const [selectedEventForGallery, setSelectedEventForGallery] = useState(null);
  const [currentGalleryImageIndex, setCurrentGalleryImageIndex] = useState(0);

  // Define categories for filter dropdown
  const eventCategories = [
    { value: "", label: "All Categories" },
    { value: "HISTORICAL", label: "Historical" },
    { value: "NATURAL", label: "Natural" },
    { value: "ADVENTURE", label: "ADVENTURE" },
    { value: "CULTURAL", label: "Cultural" },
    { value: "MUSEUM", label: "Museum" },
    { value: "PARK", label: "Park" },
    // Add more categories as needed
  ];

  // Helper function to check if any filters (excluding search) are active
  const filtersApplied = useCallback(() => {
    return (
      filters.minPrice !== "" ||
      filters.maxPrice !== "" ||
      filters.category !== "" ||
      filters.minDuration !== "" ||
      filters.location.trim() !== ""
    );
  }, [filters]);

  // Fetch events
  useEffect(() => {
    const fetchEventsFromApi = async () => {
      setLoading(true);
      setError(null); // Clear previous errors on new fetch attempt
      try {
        const response = await axios.get(`${BASE_URL}/events/all`);
        // Ensure response.data.events is an array, default to empty if not
        setEvents(response.data.events || []);
        setFilteredEvents(response.data.events || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };
    fetchEventsFromApi();
  }, []);

  // Apply search and filters
  const applyFilters = useCallback(() => {
    let tempEvents = [...events];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tempEvents = tempEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.touristicSite?.name.toLowerCase().includes(query) ||
          event.touristicSite?.location.toLowerCase().includes(query) ||
          event.touristicSite?.category.toLowerCase().includes(query)
      );
    }

    if (filters.minPrice !== "") {
      tempEvents = tempEvents.filter(
        (event) => event.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice !== "") {
      tempEvents = tempEvents.filter(
        (event) => event.price <= parseFloat(filters.maxPrice)
      );
    }
    if (filters.category) {
      tempEvents = tempEvents.filter(
        (event) => event.touristicSite?.category === filters.category
      );
    }
    if (filters.minDuration !== "") {
      tempEvents = tempEvents.filter(
        (event) => event.duration >= parseInt(filters.minDuration, 10)
      );
    }
    if (filters.location.trim()) {
      const locationQuery = filters.location.toLowerCase();
      tempEvents = tempEvents.filter((event) =>
        event.touristicSite?.location.toLowerCase().includes(locationQuery)
      );
    }

    setFilteredEvents(tempEvents);
  }, [events, searchQuery, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      category: "",
      minDuration: "",
      location: "",
    });
    setSearchQuery("");
  };

  const handleBookClick = (event) => {
    setSelectedEventForBooking(event);
    setShowBookingModal(true);
  };

  const handleBookingConfirmed = () => {
    // Optionally refetch events or update UI if needed after a booking
    setShowBookingModal(false);
  };

  const handleImageClick = (event, initialIndex = 0) => {
    setSelectedEventForGallery(event);
    setCurrentGalleryImageIndex(initialIndex);
    setShowImageGalleryModal(true);
  };

  // --- Conditional Rendering for Main Content ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">
            Loading amazing events...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Error Loading Events
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => {
              // Re-attempt fetching events
              // Call fetchEventsFromApi directly if it's in scope, or wrap it
              // For now, a reload will trigger the useEffect to refetch
              window.location.reload();
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Determine the message to show when no events are found
  const showNoSearchResultsMessage =
    filteredEvents.length === 0 && searchQuery.trim() !== "";
  const showNoFilterResultsMessage =
    filteredEvents.length === 0 && filtersApplied();
  const showNoEventsAvailableMessage =
    filteredEvents.length === 0 && !searchQuery.trim() && !filtersApplied();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 mt-8">
          <Plane className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Explore Exciting Events
          </h1>
          <p className="text-xl text-gray-600">
            Find and book unique experiences around the world.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by event, site, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-5 py-3 rounded-xl font-medium transition-all border ${
                  showFilters
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <Filter className="w-5 h-5 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 pt-6 mt-6 animate-fade-in-down">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
                  >
                    {eventCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Duration (min)
                  </label>
                  <input
                    type="number"
                    placeholder="Min Duration"
                    value={filters.minDuration}
                    onChange={(e) =>
                      handleFilterChange("minDuration", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {showNoSearchResultsMessage ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No results found for "{searchQuery}"
            </h3>
            <p className="text-gray-600 mb-4">
              Try a different search term or clear your filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Search & Filters
            </button>
          </div>
        ) : showNoFilterResultsMessage ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No events match your selected filters
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filter settings.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        ) : showNoEventsAvailableMessage ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No events available
            </h3>
            <p className="text-gray-600 mb-4">
              It looks like there are no exciting events planned yet. Check back
              later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBookClick={handleBookClick}
                onImageClick={handleImageClick} // Pass image click handler
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        event={selectedEventForBooking}
        onConfirmBooking={handleBookingConfirmed}
      />

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={showImageGalleryModal}
        onClose={() => setShowImageGalleryModal(false)}
        images={selectedEventForGallery?.images || []}
        initialIndex={currentGalleryImageIndex}
        eventTitle={selectedEventForGallery?.title || "Event Images"}
      />
    </div>
  );
};

export default TouristEventPage;
