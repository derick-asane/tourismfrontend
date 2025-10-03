// src/components/TouristicSite.jsx
import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa"; // Added FaTimes for modal close

// --- Dummy Data (Replace with your actual API calls) ---
const initialTouristicSites = [
  {
    id: "1",
    name: "Eiffel Tower",
    description:
      "An iconic wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
    city: "Paris",
    country: "France",
    imageUrl:
      "https://images.pexels.com/photos/1844696/pexels-photo-1844696.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Great Wall of China",
    description:
      "A series of fortifications that were built across the historical northern borders of ancient Chinese states and Imperial China as protection against various nomadic groups from the Eurasian Steppe.",
    city: "Beijing",
    country: "China",
    imageUrl:
      "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Colosseum",
    description:
      "The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy. Built of travertine limestone, tuff, and brick-faced concrete, it was the largest amphitheatre ever built.",
    city: "Rome",
    country: "Italy",
    imageUrl:
      "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.6,
  },
  {
    id: "4",
    name: "Taj Mahal",
    description:
      "An ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan.",
    city: "Agra",
    country: "India",
    imageUrl:
      "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.9,
  },
  {
    id: "5",
    name: "Machu Picchu",
    description:
      "An ancient Inca citadel located high in the Andes Mountains of Peru, above the Urubamba River valley.",
    city: "Cusco",
    country: "Peru",
    imageUrl:
      "https://images.pexels.com/photos/1614774/pexels-photo-1614774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.9,
  },
];

// --- Nested Helper Components for Modals and Cards ---

const TouristicSiteCard = ({
  site,
  onEdit,
  onDelete,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-2 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={
            site.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={site.name}
          className="h-full w-full object-cover"
        />
        <button
          onClick={() => onToggleFavorite(site.id)}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white/80 text-xl shadow transition-all duration-200 ease-in-out hover:scale-110 hover:bg-white ${
            isFavorite ? "text-red-500 border-red-500" : "text-gray-400"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <FaStar /> : <FaRegStar />}
        </button>
      </div>
      <div className="flex flex-grow flex-col p-5">
        <h3 className="mb-2 text-2xl font-semibold text-blue-600">
          {site.name}
        </h3>
        <p className="mb-3 flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-1 text-gray-500" /> {site.city},{" "}
          {site.country}
        </p>
        <p className="mb-4 flex-grow text-justify text-base text-gray-700">
          {site.description.substring(0, 150)}
          {site.description.length > 150 ? "..." : ""}
        </p>
        <div className="mt-auto flex justify-end space-x-3">
          <button
            onClick={() => onEdit(site)}
            className="flex items-center space-x-2 rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium text-gray-800 transition-colors duration-200 hover:bg-yellow-500"
          >
            <FaEdit /> <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(site.id)}
            className="flex items-center space-x-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600"
          >
            <FaTrash /> <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TouristicSiteFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [siteData, setSiteData] = useState({
    name: "",
    description: "",
    city: "",
    country: "",
    imageUrl: "",
    rating: 0,
  });

  useEffect(() => {
    if (initialData) {
      setSiteData(initialData);
    } else {
      setSiteData({
        name: "",
        description: "",
        city: "",
        country: "",
        imageUrl: "",
        rating: 0,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSiteData((prevData) => ({
      ...prevData,
      [name]: name === "rating" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !siteData.name ||
      !siteData.description ||
      !siteData.city ||
      !siteData.country ||
      !siteData.imageUrl
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    onSubmit(siteData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-11/12 max-w-lg animate-fade-in-scale rounded-lg bg-white p-8 shadow-2xl md:p-10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-3xl text-gray-500 transition-colors duration-200 hover:text-gray-800"
        >
          <FaTimes />
        </button>
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          {initialData ? "Edit Touristic Site" : "Add New Touristic Site"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={siteData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={siteData.description}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                City:
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={siteData.city}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Country:
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={siteData.country}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="imageUrl"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Image URL:
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={siteData.imageUrl}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="rating"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Rating (0-5):
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              value={siteData.rating}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              {initialData ? "Update Site" : "Add Site"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md bg-gray-500 px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-11/12 max-w-sm animate-fade-in-scale rounded-lg bg-white p-8 text-center shadow-2xl">
        <h3 className="mb-4 text-2xl font-bold text-gray-800">Confirmation</h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-6 py-2 text-lg font-semibold text-white transition-colors duration-200 hover:bg-red-600"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-gray-500 px-6 py-2 text-lg font-semibold text-white transition-colors duration-200 hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main TouristicSite Component ---
const TouristicSite = () => {
  const [sites, setSites] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("touristicSiteFavorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [siteToDeleteId, setSiteToDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate fetching data on component mount
  useEffect(() => {
    const fetchSites = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, this would be an API call:
        // const response = await fetch('/api/touristic-sites');
        // const data = await response.json();
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
        setSites(initialTouristicSites);
      } catch (err) {
        setError("Failed to load touristic sites.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSites();
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("touristicSiteFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleAddSite = () => {
    setEditingSite(null);
    setIsFormModalOpen(true);
  };

  const handleEditSite = (site) => {
    setEditingSite(site);
    setIsFormModalOpen(true);
  };

  const handleDeleteSite = (id) => {
    setSiteToDeleteId(id);
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = () => {
    setSites(sites.filter((site) => site.id !== siteToDeleteId));
    setFavorites(favorites.filter((favId) => favId !== siteToDeleteId)); // Also remove from favorites
    setSiteToDeleteId(null);
    setIsConfirmationModalOpen(false);
  };

  const handleFormSubmit = (siteData) => {
    if (editingSite) {
      // Update existing site
      setSites(
        sites.map((site) =>
          site.id === editingSite.id ? { ...site, ...siteData } : site
        )
      );
    } else {
      // Add new site
      const newSite = {
        ...siteData,
        id: uuidv4(),
        rating: siteData.rating || 0,
      };
      setSites([...sites, newSite]);
    }
  };

  const handleToggleFavorite = (siteId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(siteId)
        ? prevFavorites.filter((id) => id !== siteId)
        : [...prevFavorites, siteId]
    );
  };

  const filteredSites = useMemo(() => {
    if (!searchTerm) {
      return sites;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return sites.filter(
      (site) =>
        site.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        site.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        site.city.toLowerCase().includes(lowerCaseSearchTerm) ||
        site.country.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [sites, searchTerm]);

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans text-gray-800">
      {/* Page Header and Controls */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <button
          onClick={handleAddSite}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-md transition-colors duration-200 hover:bg-green-700 md:w-auto"
        >
          <FaPlus /> <span>Add Touristic Site</span>
        </button>
        <div className="flex w-full items-center space-x-3 rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm md:w-auto md:max-w-md">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full flex-grow border-none bg-transparent text-gray-700 outline-none focus:ring-0"
          />
        </div>
      </div>

      {/* Loading, Error, Empty States */}
      {isLoading && (
        <p className="py-12 text-center text-xl text-gray-600">
          Loading touristic sites...
        </p>
      )}
      {error && (
        <p className="py-12 text-center text-xl font-bold text-red-600">
          {error}
        </p>
      )}

      {!isLoading && !error && filteredSites.length === 0 && (
        <p className="py-12 text-center text-xl text-gray-600">
          No touristic sites found matching your criteria.
        </p>
      )}

      {/* Touristic Sites Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!isLoading &&
          !error &&
          filteredSites.map((site) => (
            <TouristicSiteCard
              key={site.id}
              site={site}
              onEdit={handleEditSite}
              onDelete={handleDeleteSite}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(site.id)}
            />
          ))}
      </div>

      {/* Modals */}
      <TouristicSiteFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSite}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this touristic site? This action cannot be undone."
      />
    </div>
  );
};

export default TouristicSite;
