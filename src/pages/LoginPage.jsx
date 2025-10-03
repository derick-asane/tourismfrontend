import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Briefcase,
  Building2,
  Plane,
  Mountain,
  Waves,
  Sun,
  ArrowRight,
  Check,
  MapPin, // For Site location
  DollarSign, // For Site entry fee
  Camera,
  Clock, // For Site images
} from "lucide-react";
import axios from "axios";
import {useAuth} from '../services/AuthProvider';
import {toast} from 'react-hot-toast';
import {Link, useNavigate} from 'react-router-dom'
const RoleButton = ({ icon: Icon, label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2
      ${
        selected
          ? "bg-white text-gray-900 shadow-sm border border-blue-500"
          : "text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50"
      }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("TOURIST");
  const [formData, setFormData] = useState({
    // User fields
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    // Role-specific user fields
    bio: "", // For TourGuide
    // SiteAdmin specific user field is handled via role selection, not a direct input here
    role: "",
    // TouristicSite fields (for SiteAdmin signup)
    siteName: "",
    siteDescription: "",
    siteLocation: "",
    siteLatitude: null,
    siteLongitude: null,
    siteOpeningHours: "",
    siteEntryFee: 0,
    siteImages: [], // Array to hold image files
    siteCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [siteImageFiles, setSiteImageFiles] = useState([]); // State to hold actual image files for upload
  const [uploading, setUploading] = useState(false); // For image upload progress
  const {login} =useAuth();
  const Navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handles changes for site-specific fields when SiteAdmin is selected
  const handleSiteInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    let processedFiles = [];
    let hasError = false;

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`File "${file.name}" is not a valid image.`);
        hasError = true;
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" is too large (max 5MB).`);
        hasError = true;
        continue;
      }
      processedFiles.push(file);
    }

    if (hasError) {
      setUploading(false);
      return;
    }

    setSiteImageFiles((prev) => [...prev, ...processedFiles]);
    setUploading(false);
    alert(`Successfully added ${processedFiles.length} image(s).`);
    event.target.value = "";
  };

  const removeSiteImage = (indexToRemove) => {
    setSiteImageFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      setLoading(true);
      // Handle Login
      console.log("Logging in with:", formData.email, formData.password);

      try{
          const response = await login(formData);

          if(response.user){

            if(response.user.role === "SITE_ADMIN"){
              Navigate("/siteadmin/");
            }else if(response.user.role === "TOURIST"){
              Navigate("/tourist/");
            }
            toast.success("Login successful");
            console.log("login successful", response.user);
          }
          toast.success("Login successful");
      }catch(err){  
        console.error("Login error:", err);
        
        toast.error("Login failed. Please try again.");
      }finally{ 
        setLoading(false);
      }
      // TODO: Implement login API call
    } else {
      // Handle Sign Up
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        setLoading(false);
        return;
      }
      if (!formData.name) {
        alert("Please enter your full name.");
        setLoading(false);
        return;
      }

      if (selectedRole === "GUIDE") {
        // Handle guide signup
        if (!formData.bio) {
          alert("Please enter your bio as a Tour Guide.");
          setLoading(false);
          return;
        }
        // TODO: Implement guide signup
      } else if (selectedRole === "SITE_ADMIN") {
        // Validate site admin fields
        if (!formData.siteName || !formData.siteLocation) {
          alert(
            "Please fill in at least site name and location for a new Site Admin account."
          );
          setLoading(false);
          return;
        }

        try {
          const SignUpData = new FormData();

          // User data
          SignUpData.append("name", formData.name);
          SignUpData.append("email", formData.email);
          SignUpData.append("password", formData.password);
          SignUpData.append("role", selectedRole);

          // Site data
          SignUpData.append("siteName", formData.siteName);
          SignUpData.append("siteDescription", formData.siteDescription || "");
          SignUpData.append("siteLocation", formData.siteLocation);
          SignUpData.append("siteLatitude", formData.siteLatitude || "");
          SignUpData.append("siteLongitude", formData.siteLongitude || "");
          SignUpData.append(
            "siteOpeningHours",
            formData.siteOpeningHours || ""
          );
          SignUpData.append("siteEntryFee", formData.siteEntryFee || "");
          SignUpData.append("siteCategory", formData.siteCategory || "");

          // Append site images
          if (siteImageFiles.length > 0) {
            siteImageFiles.forEach((file) => {
              SignUpData.append("siteImages", file);
            });
          }

          const response = await axios.post(
            "http://localhost:3000/tour-site/create",
            SignUpData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data) {
            toast.success("TouristicSite created successfully");
            // Reset form or redirect to login
            setIsLogin(true);
          }
        } catch (error) {
          console.error("Signup error:", error);
          alert(
            error.response?.data?.error || "Signup failed. Please try again."
          );
          toast.sucess(
            error.response?.data?.error || "Signup failed. Please try again."
          );
        } finally {
          setLoading(false);
        }
      } else {

       
          const touristData = {
            ...formData,
            role: selectedRole // ensure role is included
        };
        try{
          console.log("Sigup data:", touristData)
           const response = await axios.post(
            "http://localhost:3000/users/create",
            touristData
            );

          if (response.data) {
            toast.success("TouristicSite created successfully");
            console.log("Tourist created successfully");
            // Reset form or redirect to login
            setIsLogin(true);
          }

        }catch(error){
          console.error("Signup error:", error);
          alert(
            error.response?.data?.error || "Signup failed. Please try again."
          );
          toast.success(
            error.response?.data?.error || "Signup failed. Please try again."
          );

        }finally{
          setLoading(false);
        }
      }
    }
  };

  const features = [
    "Book unique local experiences",
    "Connect with verified guides",
    "Manage your travel itinerary",
    "Discover hidden gems",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding & Features */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 lg:p-12 text-white flex flex-col justify-between min-h-[600px]">
          <div className="absolute top-10 right-10 opacity-20">
            <Plane className="h-24 w-24" />
          </div>
          <div className="absolute bottom-20 left-10 opacity-10">
            <Mountain className="h-32 w-32" />
          </div>
          <div className="absolute top-1/2 right-0 opacity-10">
            <Waves className="h-28 w-28" />
          </div>
          <div className="absolute top-1/4 left-1/4 opacity-10">
            <Sun className="h-20 w-20" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl mr-4">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">MboaTour</h1>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Your Journey
                <span className="block text-blue-200">Begins Here</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Discover amazing destinations, connect with local guides, and
                create unforgettable travel memories.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-green-500 rounded-full p-1 mr-3">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-blue-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">150K+</div>
                <div className="text-sm text-blue-200">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">200+</div>
                <div className="text-sm text-blue-200">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-sm text-blue-200">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? "Welcome Back!" : "Create Your Account"}
              </h3>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to your account"
                  : `Sign up as a ${selectedRole
                      .replace("_", " ")
                      .toLowerCase()}`}
              </p>
            </div>

            {/* Toggle Buttons for Login/Signup */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  !isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {/* Sign Up specific role selection */}
            {!isLogin && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 p-2 bg-gray-100 rounded-xl">
                <RoleButton
                  icon={User}
                  label="Tourist"
                  selected={selectedRole === "TOURIST"}
                  onClick={() => {
                    setSelectedRole("TOURIST");
                    // Reset site-specific fields if switching away from SiteAdmin
                    setFormData((prev) => ({
                      ...prev,
                      role: "TOURIST",
                      siteName: "",
                      siteDescription: "",
                      siteLocation: "",
                      siteLatitude: null,
                      siteLongitude: null,
                      siteOpeningHours: "",
                      siteEntryFee: 0,
                      siteCategory: "",
                    }));
                    setSiteImageFiles([]);
                  }}
                />
                <RoleButton
                  icon={Briefcase}
                  label="Guide"
                  selected={selectedRole === "GUIDE"}
                  onClick={() => {
                    setSelectedRole("GUIDE");
                    // Reset site-specific fields if switching away from SiteAdmin
                    setFormData((prev) => ({
                      ...prev,
                      siteName: "",
                      siteDescription: "",
                      siteLocation: "",
                      siteLatitude: null,
                      siteLongitude: null,
                      siteOpeningHours: "",
                      siteEntryFee: 0,
                      siteCategory: "",
                    }));
                    setSiteImageFiles([]);
                  }}
                />
                <RoleButton
                  icon={Building2}
                  label="Site Admin"
                  selected={selectedRole === "SITE_ADMIN"}
                  onClick={() => setSelectedRole("SITE_ADMIN")}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Common for all roles during signup) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {selectedRole === "SITE_ADMIN" ? "Admin Name" : "Full Name"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  {selectedRole === "SITE_ADMIN"
                    ? "SiteEmail Address"
                    : "Email Address"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Role-Specific Fields (Sign Up Only) */}
              {!isLogin && (
                <>
                  {selectedRole === "GUIDE" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Bio
                      </label>
                      <div className="relative">
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="w-full pl-4 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300 resize-y"
                          placeholder="Tell us about yourself as a guide..."
                          rows="3"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {selectedRole === "SITE_ADMIN" && (
                    <>
                      {/* Site Name */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Site Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Building2 className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="siteName"
                            value={formData.siteName}
                            onChange={handleSiteInputChange}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                            placeholder="Enter the name of the touristic site"
                            required
                          />
                        </div>
                      </div>

                      {/* Site Location */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Site Location *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="siteLocation"
                            value={formData.siteLocation}
                            onChange={handleSiteInputChange}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                            placeholder="Enter the site's location"
                            required
                          />
                        </div>
                      </div>

                      {/* Site Category */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Site Category *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />{" "}
                            {/* Using MapPin for category icon */}
                          </div>
                          <select
                            name="siteCategory"
                            value={formData.siteCategory}
                            onChange={handleSiteInputChange}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300 appearance-none bg-white"
                            required
                          >
                            <option value="" disabled>
                              Select category
                            </option>
                            <option value="HISTORICAL">Historical</option>
                            <option value="NATURAL">Natural</option>
                            <option value="ADVENTURE">Adventure</option>
                            <option value="CULTURAL">Cultural</option>
                            <option value="MUSEUM">Museum</option>
                            <option value="PARK">Park</option>
                            {/* Add more categories as needed */}
                          </select>
                        </div>
                      </div>

                      {/* Site Entry Fee */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Site Entry Fee (FCFA)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="siteEntryFee"
                            value={formData.siteEntryFee}
                            onChange={handleSiteInputChange}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                            placeholder="e.g., 1000"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Site Description */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Site Description
                        </label>
                        <div className="relative">
                          <textarea
                            name="siteDescription"
                            value={formData.siteDescription}
                            onChange={handleSiteInputChange}
                            className="w-full pl-4 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300 resize-y"
                            placeholder="Describe the site..."
                            rows="3"
                          />
                        </div>
                      </div>

                      {/* Site Latitude & Longitude */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Latitude
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              name="siteLatitude"
                              value={formData.siteLatitude ?? ""}
                              onChange={handleSiteInputChange}
                              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                              placeholder="e.g., 4.05..."
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Longitude
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              name="siteLongitude"
                              value={formData.siteLongitude ?? ""}
                              onChange={handleSiteInputChange}
                              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                              placeholder="e.g., -1.51..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Site Opening Hours */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Opening Hours
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />{" "}
                            {/* Assuming Clock icon is available */}
                          </div>
                          <input
                            type="text"
                            name="siteOpeningHours"
                            value={formData.siteOpeningHours}
                            onChange={handleSiteInputChange}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-300"
                            placeholder="e.g., 9:00 AM - 5:00 PM Daily"
                          />
                        </div>
                      </div>

                      {/* Site Images Upload */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Site Images
                        </label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
                          onClick={() =>
                            document.getElementById("site-image-upload").click()
                          }
                        >
                          <input
                            id="site-image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm">
                            {uploading
                              ? "Uploading..."
                              : "Click to upload or drag & drop"}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Max 5MB per image
                          </p>
                        </div>
                        {siteImageFiles.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {siteImageFiles.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index}`}
                                  className="w-full h-20 object-cover rounded-lg border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSiteImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Remember Me & Forgot Password (Login Only) */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Terms & Conditions (Sign Up Only) */}
              {!isLogin && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center group"
              >
                {isLogin
                  ? loading
                    ? "loading..."
                    : "Sign In"
                  : loading
                  ? "loading..."
                  : "Create Account"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500 bg-white">
                Or continue with
              </span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
