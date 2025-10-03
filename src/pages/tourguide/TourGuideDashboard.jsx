import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you use axios for API calls
import { Link } from "react-router-dom"; // Assuming you use React Router for navigation

// Helper function to format currency (assuming a default currency like USD or XAF)
const formatCurrency = (amount, currency = "XAF") => {
  // Ensure amount is a number (Prisma Decimal comes as a Decimal object, might need .toNumber() on backend or frontend)
  const numAmount =
    typeof amount === "object" &&
    amount !== null &&
    typeof amount.toNumber === "function"
      ? amount.toNumber()
      : parseFloat(amount);

  if (isNaN(numAmount)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(numAmount);
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TourGuideDashboard = ({ currentGuideUserId }) => {
  const [guideData, setGuideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Dummy Data (Replace with actual API calls) ---
  const fetchGuideDashboardData = async (userId) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // In a real application, you'd fetch from an endpoint like:
      // const response = await axios.get(`/api/guide/${userId}/dashboard`);
      // const data = response.data;

      // Dummy data structure reflecting your Prisma schema for a guide
      const dummyData = {
        guide: {
          id: "guide123",
          userId: userId,
          bio: "Experienced guide specialized in ancient history and local culture. Fluent in English, French, and Spanish.",
          languages: ["English", "French", "Spanish"], // Stored as JSON
          pricePerHour: 25.5, // Decimal type
          rating: 4.8,
          numberOfReviews: 120,
          availability: {
            // Example of JSON availability
            Monday: "9:00 AM - 5:00 PM",
            Tuesday: "9:00 AM - 1:00 PM",
          },
          user: {
            // User details related to the guide
            id: userId,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profilePicture: "https://randomuser.me/api/portraits/women/44.jpg", // Dummy profile pic
          },
        },
        events: [
          // Guide's events
          {
            id: "event001",
            title: "Historic City Tour",
            description: "Explore the ancient streets and landmarks.",
            price: 50.0,
            duration: 3, // hours
            maxGroupSize: 10,
            touristicSite: { name: "Old Town Historic District" },
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            bookings: [
              // Example bookings for this event (to calculate stats)
              {
                id: "b1",
                totalPrice: 50.0,
                numberOfPeople: 1,
                status: "COMPLETED",
              },
              {
                id: "b2",
                totalPrice: 100.0,
                numberOfPeople: 2,
                status: "CONFIRMED",
              },
            ],
          },
          {
            id: "event002",
            title: "Local Cuisine Walk",
            description: "Taste the best local dishes with an expert guide.",
            price: 75.0,
            duration: 2,
            maxGroupSize: 8,
            touristicSite: { name: "Central Market" },
            createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
            bookings: [
              {
                id: "b3",
                totalPrice: 75.0,
                numberOfPeople: 1,
                status: "PENDING",
              },
              {
                id: "b4",
                totalPrice: 150.0,
                numberOfPeople: 2,
                status: "COMPLETED",
              },
            ],
          },
        ],
        bookings: [
          // All bookings related to this guide
          {
            id: "b001",
            bookingDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
            numberOfPeople: 2,
            status: "CONFIRMED",
            totalPrice: 100.0,
            tourist: { name: "John Doe" },
            event: { title: "Historic City Tour" },
            payment: { status: "COMPLETED" }, // Assuming payment info is included
          },
          {
            id: "b002",
            bookingDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            numberOfPeople: 1,
            status: "COMPLETED",
            totalPrice: 75.0,
            tourist: { name: "Jane Smith" },
            event: { title: "Local Cuisine Walk" },
            payment: { status: "COMPLETED" },
          },
          {
            id: "b003",
            bookingDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
            numberOfPeople: 3,
            status: "PENDING",
            totalPrice: 150.0,
            tourist: { name: "Mark Wilson" },
            event: { title: "Historic City Tour" },
            payment: { status: "PENDING" },
          },
        ],
      };

      setGuideData(dummyData);
    } catch (err) {
      setError("Failed to fetch dashboard data: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  // --- END Dummy Data ---

  useEffect(() => {
    if (currentGuideUserId) {
      fetchGuideDashboardData(currentGuideUserId);
    } else {
      setError("No guide user ID provided.");
      setLoading(false);
    }
  }, [currentGuideUserId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading Guide Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-700 bg-red-100 border border-red-400 rounded-md">
        <h2 className="text-xl font-bold mb-2">Error:</h2>
        <p>{error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  if (!guideData || !guideData.guide) {
    return (
      <div className="p-6 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded-md">
        <h2 className="text-xl font-bold mb-2">No Guide Data Found.</h2>
        <p>It seems your guide profile could not be loaded.</p>
      </div>
    );
  }

  const { guide, events, bookings } = guideData;
  const { user } = guide;

  // --- Calculate Dashboard Statistics ---
  const totalEvents = events.length;
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.bookingDate) > new Date() && b.status === "CONFIRMED"
  ).length;

  // Calculate total earnings from completed payments
  const totalEarnings = bookings
    .filter((b) => b.payment?.status === "COMPLETED") // Only count completed payments
    .reduce(
      (sum, b) =>
        sum +
        (typeof b.totalPrice === "object"
          ? b.totalPrice.toNumber()
          : parseFloat(b.totalPrice)),
      0
    );

  // Filter events by upcoming and past
  const upcomingEvents = events.filter((event) =>
    event.bookings.some(
      (booking) =>
        new Date(booking.bookingDate) > new Date() &&
        booking.status === "CONFIRMED"
    )
  );
  const pastEvents = events.filter((event) =>
    event.bookings.every(
      (booking) =>
        new Date(booking.bookingDate) <= new Date() ||
        booking.status === "COMPLETED"
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
          Welcome, {user.name}!
        </h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/guide/profile-settings"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Edit Profile
          </Link>
          <Link
            to="/guide/events/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            Create New Event
          </Link>
        </div>
      </header>

      {/* Statistics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard title="Total Events" value={totalEvents} />
        <DashboardStatCard title="Total Bookings" value={totalBookings} />
        <DashboardStatCard title="Upcoming Bookings" value={upcomingBookings} />
        <DashboardStatCard
          title="Total Earnings"
          value={formatCurrency(totalEarnings)}
        />
        <DashboardStatCard
          title="Average Rating"
          value={`${guide.rating} (${guide.numberOfReviews} reviews)`}
        />
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guide Profile Card (Left Column, full width on small screens) */}
        <div className="lg:col-span-1">
          <GuideProfileCard guide={guide} user={user} />
        </div>

        {/* Events & Bookings Lists (Right Columns) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
              <ul>
                {upcomingEvents.map((event) => (
                  <li
                    key={event.id}
                    className="border-b border-gray-200 py-2 last:border-b-0"
                  >
                    <Link
                      to={`/events/${event.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {event.title}
                    </Link>
                    <p className="text-gray-600 text-sm">
                      Site: {event.touristicSite.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Price: {formatCurrency(event.price)}/person
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming events found.</p>
            )}
            <div className="mt-4 text-right">
              <Link
                to="/guide/events"
                className="text-blue-600 hover:underline text-sm"
              >
                View All Events &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Bookings
            </h2>
            {bookings.length > 0 ? (
              <ul>
                {bookings
                  .sort(
                    (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
                  )
                  .slice(0, 5) // Show only 5 recent bookings
                  .map((booking) => (
                    <li
                      key={booking.id}
                      className="border-b border-gray-200 py-2 last:border-b-0"
                    >
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        {booking.event.title} - {booking.tourist.name}
                      </Link>
                      <p className="text-gray-600 text-sm">
                        Date: {formatDate(booking.bookingDate)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        People: {booking.numberOfPeople} | Total:{" "}
                        {formatCurrency(booking.totalPrice)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            booking.status === "CONFIRMED"
                              ? "text-green-600"
                              : booking.status === "PENDING"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </p>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent bookings found.</p>
            )}
            <div className="mt-4 text-right">
              <Link
                to="/guide/bookings"
                className="text-blue-600 hover:underline text-sm"
              >
                View All Bookings &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for better organization ---

const DashboardStatCard = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between items-start">
    <h3 className="text-lg font-medium text-gray-500 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const GuideProfileCard = ({ guide, user }) => {
  const languages = Array.isArray(guide.languages)
    ? guide.languages.join(", ")
    : "N/A";
  // Availability is a JSON object; you might want to format it more nicely.
  const availability =
    typeof guide.availability === "object" && guide.availability !== null
      ? Object.entries(guide.availability)
          .map(([day, hours]) => `${day}: ${hours}`)
          .join(", ")
      : "N/A";

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center mb-4">
        <img
          src={user.profilePicture || "https://via.placeholder.com/100"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mr-4"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-md text-gray-600">Tourist Guide</p>
          <div className="flex items-center text-yellow-500 mt-1">
            <span className="text-xl mr-1">⭐</span> {guide.rating} (
            {guide.numberOfReviews} reviews)
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-4 text-justify">
        {guide.bio || "No biography provided yet."}
      </p>
      <div className="space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {user.phoneNumber || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Languages:</span> {languages}
        </p>
        <p>
          <span className="font-semibold">Price per Hour:</span>{" "}
          {formatCurrency(guide.pricePerHour)}
        </p>
        <p>
          <span className="font-semibold">Availability:</span> {availability}
        </p>
      </div>
      <div className="mt-6 flex justify-between space-x-2">
        <Link
          to="/guide/messages"
          className="flex-1 text-center py-2 px-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          Messages
        </Link>
        <Link
          to="/guide/events"
          className="flex-1 text-center py-2 px-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          My Events
        </Link>
      </div>
    </div>
  );
};

export default TourGuideDashboard;
