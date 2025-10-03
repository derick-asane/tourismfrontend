import React, { useState, useEffect } from "react";
import axios from "axios"; // Assuming you use axios for API calls
import { Link } from "react-router-dom"; // Assuming you use React Router

// Helper function to format currency
const formatCurrency = (amount, currency = "XAF") => {
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

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Dummy Data (Replace with actual API calls) ---
  const fetchAdminDashboardData = async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      // In a real application, you'd fetch from an endpoint like:
      // const response = await axios.get(`/api/admin/dashboard`);
      // const data = response.data;

      // Dummy data structure reflecting your Prisma schema for a Super Admin
      const dummyData = {
        stats: {
          totalUsers: 150,
          totalTourists: 100,
          totalGuides: 30,
          totalSiteAdmins: 20,
          totalSites: 15,
          totalEvents: 75,
          totalBookings: 200,
          totalRevenue: 152345.75, // Decimal type from backend
          completedPayments: 180,
          pendingPayments: 20,
        },
        recentUsers: [
          // Recent users for quick overview
          {
            id: "u005",
            name: "Sarah Connor",
            email: "sarah@example.com",
            role: "TOURIST",
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          },
          {
            id: "u004",
            name: "Michael Guide",
            email: "michaelg@example.com",
            role: "GUIDE",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: "u003",
            name: "Site Admin Joe",
            email: "joe@example.com",
            role: "SITE_ADMIN",
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
          {
            id: "u002",
            name: "Tourist Tim",
            email: "tim@example.com",
            role: "TOURIST",
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
        ],
        recentBookings: [
          // Recent bookings
          {
            id: "b010",
            bookingDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
            totalPrice: 120.0,
            status: "CONFIRMED",
            tourist: { name: "Alice Blue" },
            event: { title: "Mountain Trek" },
            payment: { status: "COMPLETED" },
          },
          {
            id: "b009",
            bookingDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            totalPrice: 85.5,
            status: "PENDING",
            tourist: { name: "Bob Green" },
            event: { title: "Historical Walk" },
            payment: { status: "PENDING" },
          },
          {
            id: "b008",
            bookingDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            totalPrice: 200.0,
            status: "COMPLETED",
            tourist: { name: "Charlie Brown" },
            event: { title: "Safari Adventure" },
            payment: { status: "COMPLETED" },
          },
        ],
        // Placeholder for other admin data like recent reviews, system alerts etc.
      };

      setDashboardData(dummyData);
    } catch (err) {
      setError("Failed to fetch admin dashboard data: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  // --- END Dummy Data ---

  useEffect(() => {
    fetchAdminDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">
          Loading Admin Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 m-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
        <h2 className="text-xl font-bold mb-2">Error:</h2>
        <p>{error}</p>
        <p>Please check your backend API or network connection.</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6 m-4 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded-md">
        <h2 className="text-xl font-bold mb-2">No Dashboard Data Found.</h2>
        <p>It seems no administrative data could be loaded.</p>
      </div>
    );
  }

  const { stats, recentUsers, recentBookings } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
          Admin Dashboard
        </h1>
        <nav className="flex flex-wrap gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/sites"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 text-sm"
          >
            Manage Sites
          </Link>
          <Link
            to="/admin/events"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 text-sm"
          >
            Manage Events
          </Link>
        </nav>
      </header>

      {/* Statistics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <AdminStatCard title="Total Users" value={stats.totalUsers} icon="👥" />
        <AdminStatCard
          title="Total Guides"
          value={stats.totalGuides}
          icon="👨‍🏫"
        />
        <AdminStatCard title="Total Sites" value={stats.totalSites} icon="🏛️" />
        <AdminStatCard
          title="Total Events"
          value={stats.totalEvents}
          icon="📅"
        />
        <AdminStatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon="📚"
        />
        <AdminStatCard
          title="Completed Payments"
          value={stats.completedPayments}
          icon="✅"
        />
        <AdminStatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon="⏳"
        />
        <AdminStatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
          color="bg-green-100 text-green-800"
        />
      </section>

      {/* Main Content Area: Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder for Charts/Graphs */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Activity Overview
          </h2>
          <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-400 rounded-md border border-dashed border-gray-300">
            {/* Replace with actual chart component (e.g., Recharts, Chart.js) */}
            <p>
              Placeholder for Charts (e.g., Bookings over time, User growth)
            </p>
          </div>
        </div>

        {/* Recent Users List */}
        <div className="lg:col-span-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Users
          </h2>
          <ul className="divide-y divide-gray-200">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <li
                  key={user.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {user.name}
                    </Link>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === "SUPER_ADMIN"
                        ? "bg-red-100 text-red-800"
                        : user.role === "SITE_ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "GUIDE"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent users.</p>
            )}
          </ul>
          <div className="mt-4 text-right">
            <Link
              to="/admin/users"
              className="text-blue-600 hover:underline text-sm"
            >
              View All Users &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Another Row for Recent Bookings and Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Bookings List */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          <ul className="divide-y divide-gray-200">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <li key={booking.id} className="py-3">
                  <Link
                    to={`/admin/bookings/${booking.id}`}
                    className="font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {booking.event.title} by {booking.tourist.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Total: {formatCurrency(booking.totalPrice)} | Date:{" "}
                    {formatDate(booking.bookingDate)}
                  </p>
                  <div
                    className={`px-2 py-1 inline-block rounded-full text-xs font-semibold mt-1 ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {booking.status}
                  </div>
                  {booking.payment && (
                    <span
                      className={`ml-2 px-2 py-1 inline-block rounded-full text-xs font-semibold mt-1 ${
                        booking.payment.status === "COMPLETED"
                          ? "bg-blue-100 text-blue-800"
                          : booking.payment.status === "PENDING"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      Payment: {booking.payment.status}
                    </span>
                  )}
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent bookings.</p>
            )}
          </ul>
          <div className="mt-4 text-right">
            <Link
              to="/admin/bookings"
              className="text-blue-600 hover:underline text-sm"
            >
              View All Bookings &rarr;
            </Link>
          </div>
        </div>

        {/* Placeholder for Recent Reviews */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Reviews
          </h2>
          <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-400 rounded-md border border-dashed border-gray-300">
            <p>Placeholder for Recent Reviews List</p>
          </div>
          <div className="mt-4 text-right">
            <Link
              to="/admin/reviews"
              className="text-blue-600 hover:underline text-sm"
            >
              View All Reviews &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Sub-Component: Stat Card ---
const AdminStatCard = ({
  title,
  value,
  icon,
  color = "bg-blue-100 text-blue-800",
}) => (
  <div
    className={`relative ${color} shadow-md rounded-lg p-5 flex flex-col justify-between items-start overflow-hidden`}
  >
    <div className="absolute top-3 right-3 text-4xl opacity-20">{icon}</div>
    <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default AdminDashboard;
