import React, { useState, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import BASE_URL from "../../services/baseUrl";
import axios from "axios";
const SiteAdminEvents = () => {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Historical Museum Tour",
      description:
        "Explore the rich history and cultural artifacts of our city through this comprehensive guided tour of the Historical Museum.",
      price: 25.99,
      duration: 120,
      maxGroupSize: 15,
      createdAt: "2024-09-15T10:00:00Z",
      touristicSite: {
        name: "City Historical Museum",
        location: "Downtown District",
      },
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&h=600&fit=crop",
        },
        {
          id: "2",
          url: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
        },
        {
          id: "3",
          url: "https://images.unsplash.com/photo-1565883775463-7c7dba173b81?w=800&h=600&fit=crop",
        },
      ],
      bookings: [
        { status: "CONFIRMED" },
        { status: "PENDING" },
        { status: "CONFIRMED" },
      ],
    },
    {
      id: "2",
      title: "Sunset Photography Workshop",
      description:
        "Learn professional photography techniques while capturing the beautiful sunset views from our scenic overlook.",
      price: 45.0,
      duration: 180,
      maxGroupSize: 8,
      createdAt: "2024-09-10T14:30:00Z",
      touristicSite: {
        name: "Scenic Overlook",
        location: "Mountain View",
      },
      images: [
        {
          id: "4",
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        },
        {
          id: "5",
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
        },
      ],
      bookings: [
        { status: "CONFIRMED" },
        { status: "CONFIRMED" },
        { status: "COMPLETED" },
        { status: "PENDING" },
      ],
    },
    {
      id: "3",
      title: "Cultural Heritage Walk",
      description:
        "A walking tour through the old quarter, discovering traditional architecture and local customs.",
      price: 18.5,
      duration: 90,
      maxGroupSize: 20,
      createdAt: "2024-09-08T09:15:00Z",
      touristicSite: {
        name: "Old Quarter",
        location: "Historic Center",
      },
      images: [
        {
          id: "6",
          url: "https://images.unsplash.com/photo-1539650116574-75c0c6d0e9d3?w=800&h=600&fit=crop",
        },
      ],
      bookings: [{ status: "COMPLETED" }, { status: "CONFIRMED" }],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    maxGroupSize: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  // Fetch admin events from API
  const fetchEvents = async () => {
    const site = JSON.parse(sessionStorage.getItem("site"));
    try {
      const response = await axios.get(
        `${BASE_URL}/events/siteadmin/events/${site.admin.id}`
      );
      const result = response.data;
      console.log("Fetched events:", result);
      if (result.isOk) {
        // The API returns events in result.sites (based on your controller)
        setEvents(result.events || []);
      } else {
        console.error("Failed to fetch events:", result.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Load events on component mount
  React.useEffect(() => {
    fetchEvents();
  }, []);

  // Filter and search events
  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.touristicSite.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      if (filterStatus === "all") return matchesSearch;

      const hasBookings = event.bookings.length > 0;
      if (filterStatus === "active") return matchesSearch && hasBookings;
      if (filterStatus === "inactive") return matchesSearch && !hasBookings;

      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "duration":
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins > 0 ? mins + "m" : ""}` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBookingStats = (bookings) => {
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const pending = bookings.filter((b) => b.status === "PENDING").length;
    const completed = bookings.filter((b) => b.status === "COMPLETED").length;
    return { confirmed, pending, completed, total: bookings.length };
  };

  // Modal handlers
  const handleAddEvent = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      duration: "",
      maxGroupSize: "",
    });
    setSelectedImages([]);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      price: event.price,
      duration: event.duration,
      maxGroupSize: event.maxGroupSize,
    });
    setSelectedImages([]);
    setImagesToRemove([]);
    setShowEventModal(true);
  };

  // Handle deletion of event
  const handleDeleteEvent = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok && result.isOk) {
        console.log("Event deleted successfully:", result.message);
        fetchEvents(); // Refresh the events list
      } else {
        console.error("Failed to delete event:", result.message);
        alert(result.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Network error: Failed to delete event");
    }
  };

  // Handle removal of existing images in edit mode
  const handleRemoveExistingImage = (imageId) => {
    setImagesToRemove((prev) => [...prev, imageId]);
  };

  const handleImageClick = (images, index) => {
    setGalleryImages(images);
    setCurrentImageIndex(index);
    setShowImageGallery(true);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setSelectedImages((prev) => [...prev, ...imageFiles]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const site = JSON.parse(sessionStorage.getItem("site"));

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("maxGroupSize", formData.maxGroupSize);

    // Add required fields for your backend
    // Replace these with actual values from your auth context or props
    formDataToSend.append("touristicSiteId", site.id); // Get from context/props
    formDataToSend.append("siteAdminId", site.admin.id); // Get from auth context

    // Append images using the field name expected by multer (eventImages)
    selectedImages.forEach((image) => {
      formDataToSend.append("eventImages", image);
    });

    // For edit operations, add images to remove
    if (editingEvent && imagesToRemove.length > 0) {
      formDataToSend.append("imagesToRemove", JSON.stringify(imagesToRemove));
    }

    try {
      const url = editingEvent
        ? `/api/events/${editingEvent.id}`
        : `${BASE_URL}/events/create`;

      const method = editingEvent ? "PUT" : "POST";

      const response = await axios.post(
        url,
        formDataToSend
        // Don't set Content-Type header - let browser set it with boundary for multipart
      );

      const result = response.data;

      if (result.isOk) {
        // Handle success - refresh events list
        console.log("Event saved successfully:", result.message);
        setShowEventModal(false);

        // Refresh the events list
        fetchEvents();

        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          duration: "",
          maxGroupSize: "",
        });
        setSelectedImages([]);
        setImagesToRemove([]);
      } else {
        console.error("Server error:", result.message);
        alert(result.message || "Failed to save event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Network error: Failed to save event");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
              <p className="text-gray-600 mt-1">
                Manage your touristic site events
              </p>
            </div>
            <button
              onClick={handleAddEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={20} />
              Add New Event
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search events by title, description, or site..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block mt-4 pt-4 border-t border-gray-200`}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Events</option>
                  <option value="active">Active (with bookings)</option>
                  <option value="inactive">Inactive (no bookings)</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="duration">Duration: Longest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first event to get started."}
            </p>
            <button
              onClick={handleAddEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus size={20} />
              Add New Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const stats = getBookingStats(event.bookings);
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Event Image */}
                  {event.images && event.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`${BASE_URL}${event.images[0].url}`}
                        alt={event.title}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => handleImageClick(event.images, 0)}
                      />
                      {event.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                          +{event.images.length - 1} more
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    {/* Event Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex gap-2 ml-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Site Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin size={16} />
                      <span className="font-medium">
                        {event.touristicSite.name}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{event.touristicSite.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-semibold text-green-600">
                          ${event.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-600" />
                        <span className="text-gray-700">
                          {formatDuration(event.duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-purple-600" />
                        <span className="text-gray-700">
                          Max {event.maxGroupSize}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-gray-700">
                          {formatDate(event.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Booking Stats */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Bookings
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {stats.total} total
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-center">
                          <div className="font-semibold">{stats.confirmed}</div>
                          <div>Confirmed</div>
                        </div>
                        <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-center">
                          <div className="font-semibold">{stats.pending}</div>
                          <div>Pending</div>
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-center">
                          <div className="font-semibold">{stats.completed}</div>
                          <div>Completed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Summary */}
        {filteredEvents.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        )}
      </div>

      {/* Add/Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter event title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your event..."
                />
              </div>

              {/* Price, Duration, Max Group Size */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Group Size *
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.maxGroupSize}
                    onChange={(e) =>
                      setFormData({ ...formData, maxGroupSize: e.target.value })
                    }
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Images
                </label>

                {/* Existing Images (for edit mode) */}
                {editingEvent &&
                  editingEvent.images &&
                  editingEvent.images.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Current Images
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {editingEvent.images
                          .filter((img) => !imagesToRemove.includes(img.id))
                          .map((image) => (
                            <div key={image.id} className="relative">
                              <img
                                src={image.url}
                                alt="Current event image"
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveExistingImage(image.id)
                                }
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* New Images Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-gray-600 mb-2">
                    {editingEvent
                      ? "Add new images"
                      : "Drop images here or click to browse"}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Choose Images
                  </button>
                </div>

                {/* Selected New Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      New Images to Upload
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setShowImageGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Main Image */}
            <img
              src={galleryImages[currentImageIndex].url}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteAdminEvents;
