import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Menu,
  X,
  Settings,
  Search,
  Heart,
  MapPin,
  Camera,
  DollarSign,
  Star,
  Trash,
  Trash2,
  Eye,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown, // Added for image gallery navigation
  Clock, // Added for openingHours field
} from "lucide-react";
import BASE_URL from "../../services/baseUrl"
import toast from "react-hot-toast";
import axios from "axios";

// Helper to render star ratings
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    );
  }
  return (
    <div className="flex items-center">
      {stars}
      {rating > 0 && (
        <span className="text-xs text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

const AdminSiteTouristicSite = () => {
  const navigate = useNavigate();

  // State management for touristic sites
  const [touristicSites, setTouristicSites] = useState([]);
  const [filteredTouristicSites, setFilteredTouristicSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
    minRating: "",
    location: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Modal states for touristic sites
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEditSiteModal, setShowEditSiteModal] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [newSite, setNewSite] = useState({
    name: "",
    description: "",
    entryFee: 0, // Corresponds to entryFee in Prisma
    location: "",
    latitude: null,
    longitude: null,
    category: "",
    openingHours: "", // New field for opening hours
    // Rating can be set during review, not necessarily here for creation
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  // Temporary states for editing
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [message, setMessage] = useState(null); // For image upload messages

  // Define categories for touristic sites based on Prisma schema
  const siteCategories = [
    { value: "", label: "All Categories" },
    { value: "HISTORICAL", label: "Historical" },
    { value: "NATURAL", label: "Natural" },
    { value: "ADVENTURE", label: "Adventure" },
    { value: "CULTURAL", label: "Cultural" },
    { value: "MUSEUM", label: "Museum" },
    { value: "PARK", label: "Park" },
    // Add more categories based on your actual data or needs
  ];

  const fetchTouristicSites = async () => {
    try {
      setLoading(true);
      // Adjust the API endpoint to fetch touristic sites
      const response = await axios.get(`${BASE_URL}/tour-site/allsites`);
      console.log("API response:", response.data.sites);
      // Assuming your API returns data in a structure like { data: [...] }
      const data = response.data.sites || response.data;
      setTouristicSites(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch touristic sites. Please try again later.");
      console.error("Error fetching touristic sites:", err);
      toast.error("Failed to load sites.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic for touristic sites
  const applyFilters = useCallback(() => {
    let filtered = [...touristicSites];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(query) ||
          (site.description &&
            site.description.toLowerCase().includes(query)) ||
          site.location.toLowerCase().includes(query) ||
          site.category.toLowerCase().includes(query)
      );
    }

    // Price filters (entryFee)
    if (filters.minPrice !== "") {
      filtered = filtered.filter(
        (site) => site.entryFee >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice !== "") {
      filtered = filtered.filter(
        (site) => site.entryFee <= parseFloat(filters.maxPrice)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((site) => site.category === filters.category);
    }

    // Rating filter
    if (filters.minRating !== "") {
      filtered = filtered.filter(
        (site) => site.rating >= parseInt(filters.minRating)
      );
    }

    // Location filter
    if (filters.location.trim()) {
      const locationQuery = filters.location.toLowerCase();
      filtered = filtered.filter((site) =>
        site.location.toLowerCase().includes(locationQuery)
      );
    }

    setFilteredTouristicSites(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [touristicSites, searchQuery, filters]);

  // Effects
  useEffect(() => {
    fetchTouristicSites();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      category: "",
      minRating: "",
      location: "",
    });
    setSearchQuery("");
  };

  // Modal handlers for touristic sites
  const openImageGallery = (site, imageIndex = 0) => {
    setSelectedSite(site);
    setCurrentImageIndex(imageIndex);
    setShowImageGallery(true);
  };

  const closeImageGallery = () => {
    setShowImageGallery(false);
    setSelectedSite(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedSite && selectedSite.images && selectedSite.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedSite.images.length);
    }
  };

  const prevImage = () => {
    if (selectedSite && selectedSite.images && selectedSite.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedSite.images.length - 1 : prev - 1
      );
    }
  };

  const openEditSiteModal = (site) => {
    setEditingSite({ ...site });
    setNewImages([]); // Reset temporary states for new images
    setImagesToRemove([]); // Reset for image removals
    setShowEditSiteModal(true);
  };

  const handleAddSiteModalPop = () => {
    setShowAddSiteModal(true);
  };

  const closeAddSiteModal = () => {
    setShowAddSiteModal(false);
    setNewSite({
      // Reset form on close
      name: "",
      description: "",
      entryFee: 0,
      location: "",
      latitude: null,
      longitude: null,
      category: "",
      openingHours: "", // Reset new opening hours
      images: [],
    });
    setNewImages([]); // Clear any staged new images
  };

  const closeEditSiteModal = () => {
    setShowEditSiteModal(false);
    setEditingSite(null);
    setNewImages([]);
    setImagesToRemove([]);
  };

  const handleSiteEditChange = (field, value) => {
    setEditingSite((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Remove existing image during edit
  const removeExistingImage = (imageId) => {
    setEditingSite((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
    setImagesToRemove((prev) => [...prev, imageId]);
  };

  // Remove newly added image during edit
  const removeNewImage = (fileIndex) => {
    setNewImages((prev) => prev.filter((_, index) => index !== fileIndex));
  };

  // Add new site handlers
  const handleAddSiteChange = (field, value) => {
    setNewSite((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Image upload handling
  const handleImageUpload = (event, targetStateSetter, isAddingNew = false) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    let processedFiles = [];
    let hasError = false;

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setMessage({
          type: "error",
          text: `File "${file.name}" is not a valid image.`,
        });
        hasError = true;
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: `File "${file.name}" is too large (max 5MB).`,
        });
        hasError = true;
        continue;
      }

      if (isAddingNew) {
        const uniqueId =
          Date.now().toString() + Math.random().toString(36).substring(2, 9);
        const imageUrl = URL.createObjectURL(file);
        processedFiles.push({
          id: uniqueId,
          url: imageUrl,
          file: file,
          name: file.name,
        });
      } else {
        processedFiles.push(file); // Just the File object for editing
      }
    }

    if (hasError) {
      setUploading(false);
      return;
    }

    targetStateSetter((prev) => [...prev, ...processedFiles]);
    setUploading(false);
    setMessage({
      type: "success",
      text: `Successfully added ${processedFiles.length} image(s).`,
    });
    event.target.value = ""; // Clear the input
  };

  const handleImageUploadEdit = (event) => {
    handleImageUpload(event, setNewImages, false);
  };

  const handleImageUploadAdd = (event) => {
    handleImageUpload(
      event,
      (updatedImages) => {
        setNewSite((prev) => ({ ...prev, images: updatedImages }));
      },
      true
    );
  };

  // Save changes for an existing site
  const handleSaveChanges = async () => {
    if (!editingSite) return;

    const formData = new FormData();
    // Append the main site data, converting numbers/booleans if necessary
    formData.append("name", editingSite.name);
    formData.append("description", editingSite.description || "");
    formData.append("entryFee", editingSite.entryFee);
    formData.append("location", editingSite.location);
    formData.append(
      "latitude",
      editingSite.latitude !== null ? editingSite.latitude.toString() : ""
    );
    formData.append(
      "longitude",
      editingSite.longitude !== null ? editingSite.longitude.toString() : ""
    );
    formData.append("category", editingSite.category);
    formData.append("openingHours", editingSite.openingHours || ""); // Include openingHours
    // Note: Rating is typically derived from reviews, not directly edited here unless the schema allows it.

    // Append images to remove and new images
    formData.append("imagesToRemove", JSON.stringify(imagesToRemove));
    newImages.forEach((image) => {
      formData.append("images", image); // Append File objects
    });

    try {
      const response = await axios.put(
        `${BASE_URL}/touristic-sites/update/${editingSite.id}`, // Adjust endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = await response.data;
      console.log("Site updated successfully:", result);
      toast.success("Touristic site updated successfully!");
      fetchTouristicSites(); // Re-fetch data to reflect changes
      closeEditSiteModal();
    } catch (error) {
      console.error("Failed to update site:", error);
      toast.error(
        "Failed to update touristic site. Please check console for details."
      );
    }
  };

  // Handle drag and drop for image uploads
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Save new touristic site
  const handleSaveNewSite = async () => {
    // Basic validation
    if (
      !newSite.name ||
      !newSite.location ||
      !newSite.category ||
      newSite.entryFee < 0
    ) {
      toast.error(
        "Please fill in all required fields (Name, Location, Category, valid Entry Fee)."
      );
      return;
    }

    const submitData = new FormData();

    submitData.append("name", newSite.name);
    submitData.append("description", newSite.description || "");
    submitData.append("entryFee", newSite.entryFee);
    submitData.append("location", newSite.location);
    if (newSite.latitude !== null)
      submitData.append("latitude", newSite.latitude.toString());
    if (newSite.longitude !== null)
      submitData.append("longitude", newSite.longitude.toString());
    submitData.append("category", newSite.category);
    submitData.append("openingHours", newSite.openingHours || ""); // Include openingHours

    // Add image files
    if (newSite.images && newSite.images.length > 0) {
      newSite.images.forEach((image) => {
        if (image.file) {
          submitData.append("images", image.file); // Append File objects
        }
      });
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/touristic-sites/create`, // Adjust endpoint
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Site creation response:", response.data);
      // Assuming your API returns { isOk: true, data: newSiteObject } on success
      if (response.data.isOk || response.status === 201) {
        toast.success("Touristic site added successfully!");
        fetchTouristicSites(); // Re-fetch data
        closeAddSiteModal();
      } else {
        throw new Error(response.data.message || "Failed to create site");
      }
    } catch (error) {
      console.error("Error adding site:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      toast.error(`Failed to add site: ${errorMessage}`);
    }
  };

  // Remove image from add site form
  const removeImageFromAddForm = (imageId) => {
    setNewSite((prev) => {
      const updatedImages = prev.images.filter((img) => img.id !== imageId);
      const removedImage = prev.images.find((img) => img.id === imageId);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.url); // Clean up object URL
      }
      return { ...prev, images: updatedImages };
    });
  };

  const handleDeleteSite = async (siteId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this touristic site? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}/touristic-sites/delete/${siteId}` // Adjust endpoint
      );

      if (response.data.isOk) {
        // Adjust based on your API's success indicator
        toast.success("Touristic site deleted successfully!");
        fetchTouristicSites(); // Re-fetch data
      } else {
        toast.error(
          response.data.message || "Failed to delete touristic site."
        );
      }
    } catch (error) {
      console.error("Error deleting site:", error);
      toast.error("Failed to delete site. Please try again.");
    }
  };

  // Format entry fee
  const formatPrice = (price) => {
    // Ensure price is a number before formatting
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return "N/A";
    }
    // Using 'en-US' locale with currency XAF.
    // Ensure your environment supports this currency code for full symbol display.
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF", // Using XAF for Central African CFA franc
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredTouristicSites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTouristicSites = filteredTouristicSites.slice(
    startIndex,
    endIndex
  );

  // Touristic Site Card Component
  const TouristicSiteCard = ({ site, isListView = false }) => {
    const [isFavorited, setIsFavorited] = useState(false); // If you have a favorites feature
    const [imageError, setImageError] = useState(false);
    const siteRating = site.rating || 0; // Use site.rating directly

    const handleSiteClick = () => {
      openImageGallery(site);
    };

    const handleEditClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEditSiteModal(site);
    };

    const handleDeleteClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleDeleteSite(site.id);
    };

    const handleImageError = () => {
      setImageError(true);
    };

    const FallbackImage = () => (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm font-medium">
            {site.category || "Site"}
          </p>
        </div>
      </div>
    );

    const primaryImageUrl =
      site.images && site.images.length > 0
        ? `${BASE_URL}${site.images[0].url}`
        : null;
    // const imageUrls = site.images // Not directly used in the card itself, but kept for context
    //   ? site.images.map((img) => `${BASE_URL}${img.url}`)
    //   : [];

    if (isListView) {
      return (
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="w-80 h-64 flex-shrink-0 relative overflow-hidden">
            {imageError || !primaryImageUrl ? (
              <FallbackImage />
            ) : (
              <img
                src={primaryImageUrl}
                alt={site.name}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onError={handleImageError}
                onClick={handleSiteClick}
                loading="lazy"
              />
            )}
            {site.images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                +{site.images.length - 1} photos
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {site.name}
                </h3>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="text-sm line-clamp-1">{site.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(site.entryFee)}
                </p>
                <StarRating rating={siteRating} />
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {site.description}
            </p>

            <div className="grid grid-cols-2 gap-y-2 mb-4">
              <div className="flex items-center text-gray-700">
                <Camera className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm capitalize font-medium">{site.category}</span>
              </div>
              {site.openingHours && (
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="text-sm line-clamp-1">{site.openingHours}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Potentially add info about Site Admin if relevant */}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Settings className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Trash className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div onClick={handleSiteClick} className="cursor-pointer">
          <div className="relative overflow-hidden h-64">
            {imageError || !primaryImageUrl ? (
              <FallbackImage />
            ) : (
              <img
                src={primaryImageUrl}
                alt={site.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                onError={handleImageError}
                onClick={(e) => {
                  e.stopPropagation();
                  openImageGallery(site, 0);
                }}
                loading="lazy"
              />
            )}
            {site.images.length > 1 && (
              <div
                className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openImageGallery(site, 0);
                }}
              >
                +{site.images.length - 1} photos
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
              {site.name}
            </h3>
            <div className="text-right ml-2">
              <p className="text-xl font-bold text-blue-600">
                {formatPrice(site.entryFee)}
              </p>
              <StarRating rating={siteRating} />
            </div>
          </div>

          <div className="space-y-2 mb-4 text-gray-700 text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{site.location}</span>
            </div>
            <div className="flex items-center">
              <Camera className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="capitalize font-medium">{site.category}</span>
            </div>
            {site.openingHours && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{site.openingHours}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2 mt-4 border-t pt-4 border-gray-100">
            <button
              onClick={handleEditClick}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Settings className="w-4 h-4 inline mr-1" />
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              <Trash className="w-4 h-4 inline mr-1" />
              Delete
            </button>
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
          <p className="text-gray-600">Loading touristic sites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-800 text-xl mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTouristicSites}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">
                  My Touristic Sites
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Touristic Sites
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredTouristicSites.length} sites found
              </p>
            </div>

            <button
              onClick={handleAddSiteModalPop}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Camera className="w-4 h-4 mr-2" />
              Add Touristic Site
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  showFilters
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (Entry Fee)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {siteCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) =>
                      handleFilterChange("minRating", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="1">1 Star+</option>
                    <option value="2">2 Stars+</option>
                    <option value="3">3 Stars+</option>
                    <option value="4">4 Stars+</option>
                    <option value="5">5 Stars</option>
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
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

        {filteredTouristicSites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No touristic sites found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                  : "space-y-6 mb-8"
              }
            >
              {currentTouristicSites.map((site, index) => (
                <TouristicSiteCard
                  key={site.id}
                  site={site}
                  isListView={viewMode === "list"}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Image Gallery Modal */}
      {showImageGallery && selectedSite && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full mx-4">
            <button
              onClick={closeImageGallery}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative">
              {selectedSite.images && selectedSite.images.length > 0 ? (
                <img
                  src={`${BASE_URL}${selectedSite.images[currentImageIndex]?.url}`}
                  alt={`${selectedSite.name} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              ) : (
                <div className="w-96 h-96 bg-gray-700 flex items-center justify-center text-white">
                  No Image Available
                </div>
              )}

              {selectedSite.images && selectedSite.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <ChevronDown className="w-6 h-6 rotate-90" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <ChevronDown className="w-6 h-6 -rotate-90" />
                  </button>
                </>
              )}
              {selectedSite.images && selectedSite.images.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedSite.images.length}
                </div>
              )}
            </div>

            {selectedSite.images && selectedSite.images.length > 1 && (
              <div className="mt-4 flex justify-center space-x-2 overflow-x-auto">
                {selectedSite.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-white"
                        : "border-transparent opacity-60 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={`${BASE_URL}${image?.url}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/50 text-white p-4 rounded-lg max-w-sm">
              <h3 className="font-semibold text-lg mb-1">
                {selectedSite.name}
              </h3>
              <p className="text-sm opacity-90 mb-2">{selectedSite.location}</p>
              <p className="text-xl font-bold">
                {formatPrice(selectedSite.entryFee)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Touristic Site Modal */}
      {showEditSiteModal && editingSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Touristic Site
                </h2>
                <button
                  onClick={closeEditSiteModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name *
                  </label>
                  <input
                    type="text"
                    value={editingSite.name}
                    onChange={(e) =>
                      handleSiteEditChange("name", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter site name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={editingSite.category}
                    onChange={(e) =>
                      handleSiteEditChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {siteCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Entry Fee / Cost) *
                  </label>
                  <input
                    type="number"
                    value={editingSite.entryFee}
                    onChange={(e) =>
                      handleSiteEditChange(
                        "entryFee",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    value={editingSite.latitude ?? ""} // Handle null for controlled input
                    onChange={(e) =>
                      handleSiteEditChange(
                        "latitude",
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter latitude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    value={editingSite.longitude ?? ""} // Handle null for controlled input
                    onChange={(e) =>
                      handleSiteEditChange(
                        "longitude",
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter longitude"
                  />
                </div>
                {/* New: Opening Hours Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Hours
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={editingSite.openingHours || ""}
                      onChange={(e) =>
                        handleSiteEditChange("openingHours", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 9:00 AM - 5:00 PM Daily"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={editingSite.location}
                  onChange={(e) =>
                    handleSiteEditChange("location", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  value={editingSite.description || ""}
                  onChange={(e) =>
                    handleSiteEditChange("description", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter site description"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Site Images ({editingSite.images?.length || 0})
                </h3>

                <div
                  className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onDrop={handleDragOver}
                  onDragOver={handleDragOver}
                  onClick={() =>
                    document.getElementById("image-upload-edit").click()
                  }
                >
                  <input
                    id="image-upload-edit"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUploadEdit}
                    className="hidden"
                  />
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">
                    {uploading
                      ? "Uploading images..."
                      : "Click to upload images or drag & drop"}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Supported formats: JPG, PNG, WebP (Max 5MB each)
                  </p>
                </div>

                {(editingSite.images && editingSite.images.length > 0) ||
                newImages.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {editingSite.images.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={`${BASE_URL}${image.url}`}
                            alt="Site image"
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openImageGallery(
                                    editingSite,
                                    editingSite.images.findIndex(
                                      (img) => img.id === image.id
                                    )
                                  )
                                }
                                className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-all"
                                title="View image"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeExistingImage(image.id)}
                                className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-all"
                                title="Remove existing image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 rounded-b-lg truncate">
                            {image.name || `Image`}
                          </div>
                        </div>
                      ))}
                      {newImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-green-500"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-all"
                                title="Remove image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs p-2 rounded-b-lg truncate">
                            New Image
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No images uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={closeEditSiteModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Touristic Site Modal */}
      {showAddSiteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add Touristic Site
                </h2>
                <button
                  onClick={closeAddSiteModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name *
                  </label>
                  <input
                    type="text"
                    value={newSite.name}
                    onChange={(e) =>
                      handleAddSiteChange("name", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter site name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={newSite.category}
                    onChange={(e) =>
                      handleAddSiteChange("category", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {siteCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (Entry Fee / Cost) *
                  </label>
                  <input
                    type="number"
                    value={newSite.entryFee}
                    onChange={(e) =>
                      handleAddSiteChange(
                        "entryFee",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    value={newSite.latitude ?? ""}
                    onChange={(e) =>
                      handleAddSiteChange(
                        "latitude",
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter latitude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    value={newSite.longitude ?? ""}
                    onChange={(e) =>
                      handleAddSiteChange(
                        "longitude",
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter longitude"
                  />
                </div>
                {/* New: Opening Hours Field for Add Modal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Hours
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newSite.openingHours}
                      onChange={(e) =>
                        handleAddSiteChange("openingHours", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 9:00 AM - 5:00 PM Daily"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={newSite.location}
                  onChange={(e) =>
                    handleAddSiteChange("location", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  value={newSite.description || ""}
                  onChange={(e) =>
                    handleAddSiteChange("description", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter site description"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Site Images ({newSite.images.length})
                </h3>

                <div
                  className="mb-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onDrop={handleDragOver}
                  onDragOver={handleDragOver}
                  onClick={() =>
                    document.getElementById("image-upload-add").click()
                  }
                >
                  <input
                    id="image-upload-add"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUploadAdd}
                    className="hidden"
                  />
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">
                    {uploading
                      ? "Uploading images..."
                      : "Click to upload images or drag & drop"}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Supported formats: JPG, PNG, WebP (Max 5MB each)
                  </p>
                </div>

                {newSite.images && newSite.images.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newSite.images.map((image, index) => (
                        <div key={image.id || index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Site image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                              <button
                                type="button"
                                onClick={() => openImageGallery(newSite, index)}
                                className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-all"
                                title="View image"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImageFromAddForm(image.id)}
                                className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-all"
                                title="Remove image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 rounded-b-lg truncate">
                            {image.name || `Image ${index + 1}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No images uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={closeAddSiteModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewSite}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Save Site
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSiteTouristicSite;