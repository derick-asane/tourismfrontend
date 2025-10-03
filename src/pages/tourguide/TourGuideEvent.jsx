import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Edit3,
  Trash2,
  Eye,
  X,
  Save,
  Search,
  Filter,
  MoreVertical,
  BookOpen,
  Star,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const TourGuideEvent = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data based on Prisma schema
  const mockEvents = [
    {
      id: "1",
      title: "Guided Museum Tour",
      description:
        "Explore the fascinating history and art collections with our expert guide. Perfect for art enthusiasts and history buffs.",
      price: 25.0,
      duration: 120,
      maxGroupSize: 15,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      touristicSiteId: "site1",
      siteAdminId: "admin1",
      bookings: [
        {
          id: "b1",
          status: "CONFIRMED",
          numberOfPeople: 8,
          tourist: { name: "John Doe" },
        },
        {
          id: "b2",
          status: "PENDING",
          numberOfPeople: 4,
          tourist: { name: "Jane Smith" },
        },
      ],
      touristicSite: {
        name: "Louvre Museum",
        location: "Paris, France",
      },
    },
    {
      id: "2",
      title: "Photography Workshop",
      description:
        "Learn professional photography techniques while capturing the beauty of our historic site.",
      price: 45.0,
      duration: 180,
      maxGroupSize: 8,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
      touristicSiteId: "site1",
      siteAdminId: "admin1",
      bookings: [
        {
          id: "b3",
          status: "COMPLETED",
          numberOfPeople: 6,
          tourist: { name: "Mike Johnson" },
        },
      ],
      touristicSite: {
        name: "Louvre Museum",
        location: "Paris, France",
      },
    },
    {
      id: "3",
      title: "Sunset Viewing Experience",
      description:
        "Witness breathtaking sunsets from our exclusive viewing deck with complimentary refreshments.",
      price: 35.0,
      duration: 90,
      maxGroupSize: 20,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-05"),
      touristicSiteId: "site2",
      siteAdminId: "admin1",
      bookings: [],
      touristicSite: {
        name: "Santorini Cliff View",
        location: "Oia, Greece",
      },
    },
  ];

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    maxGroupSize: "",
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedStatus, events]);

  const filterEvents = () => {
    let filtered = [...events];

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      // Filter by booking status or other criteria
      filtered = filtered.filter((event) => {
        if (selectedStatus === "active") return event.bookings.length > 0;
        if (selectedStatus === "inactive") return event.bookings.length === 0;
        return true;
      });
    }

    setFilteredEvents(filtered);
  };

  const handleAddEvent = () => {
    const event = {
      id: `event_${Date.now()}`,
      ...newEvent,
      price: parseFloat(newEvent.price),
      duration: parseInt(newEvent.duration),
      maxGroupSize: parseInt(newEvent.maxGroupSize),
      createdAt: new Date(),
      updatedAt: new Date(),
      bookings: [],
      touristicSite: {
        name: "Current Site",
        location: "Current Location",
      },
    };

    setEvents([event, ...events]);
    setNewEvent({
      title: "",
      description: "",
      price: "",
      duration: "",
      maxGroupSize: "",
    });
    setShowAddModal(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
    setShowEditModal(true);
  };

  const handleUpdateEvent = () => {
    setEvents(
      events.map((event) =>
        event.id === editingEvent.id
          ? { ...editingEvent, updatedAt: new Date() }
          : event
      )
    );
    setShowEditModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  const getBookingStats = (event) => {
    const totalBookings = event.bookings.length;
    const confirmedBookings = event.bookings.filter(
      (b) => b.status === "CONFIRMED"
    ).length;
    const pendingBookings = event.bookings.filter(
      (b) => b.status === "PENDING"
    ).length;

    return { totalBookings, confirmedBookings, pendingBookings };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const EventCard = ({ event }) => {
    const { totalBookings, confirmedBookings, pendingBookings } =
      getBookingStats(event);
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {event.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{event.touristicSite?.name}</span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      handleEditEvent(event);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Event
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteEvent(event.id);
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-semibold">{formatPrice(event.price)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              <span>{event.duration} minutes</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-purple-600" />
              <span>Max {event.maxGroupSize} people</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-orange-600" />
              <span>{event.createdAt.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Booking Stats */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Booking Statistics
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalBookings}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {confirmedBookings}
                </div>
                <div className="text-xs text-gray-600">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingBookings}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          {event.bookings.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Recent Bookings
              </h4>
              <div className="space-y-2">
                {event.bookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-2"
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">
                        {booking.tourist.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">
                        {booking.numberOfPeople} people
                      </span>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => alert(`Viewing bookings for ${event.title}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Bookings
            </button>
            <button
              onClick={() => handleEditEvent(event)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EventModal = ({ show, onClose, title, event, onSave, onChange }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={event.title}
                  onChange={(e) =>
                    onChange({ ...event, title: e.target.value })
                  }
                  placeholder="Enter event title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={event.description}
                  onChange={(e) =>
                    onChange({ ...event, description: e.target.value })
                  }
                  placeholder="Enter event description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={event.price}
                    onChange={(e) =>
                      onChange({ ...event, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={event.duration}
                    onChange={(e) =>
                      onChange({ ...event, duration: e.target.value })
                    }
                    placeholder="60"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Group Size
                  </label>
                  <input
                    type="number"
                    value={event.maxGroupSize}
                    onChange={(e) =>
                      onChange({ ...event, maxGroupSize: e.target.value })
                    }
                    placeholder="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Event Management
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage events for your touristic site
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Event
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                <option value="active">With Bookings</option>
                <option value="inactive">No Bookings</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first event to get started
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add New Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Add Event Modal */}
        <EventModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setNewEvent({
              title: "",
              description: "",
              price: "",
              duration: "",
              maxGroupSize: "",
            });
          }}
          title="Add New Event"
          event={newEvent}
          onChange={setNewEvent}
          onSave={handleAddEvent}
        />

        {/* Edit Event Modal */}
        <EventModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingEvent(null);
          }}
          title="Edit Event"
          event={editingEvent || {}}
          onChange={setEditingEvent}
          onSave={handleUpdateEvent}
        />
      </div>
    </div>
  );
};

export default TourGuideEvent;
