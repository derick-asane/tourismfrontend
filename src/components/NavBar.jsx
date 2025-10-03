import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  Settings,
  BarChart3,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Bell,
  HelpCircle,
  CreditCard,
  Database,
  UserPlus,
  FileText,
  Activity,
  Package,
  Moon,
  Sun,
  Building2,
  Search,
  Heart,
  MapPin,
  Calculator,
  Phone,
  Mail,
  Calendar,
  Camera,
  DollarSign,
  TrendingUp,
  Filter,
  Star,
  HouseIcon,
  Building,
} from "lucide-react";

import { useAuth } from "../services/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
const navigationConfig = {
  TOURIST: [
    {
      name: "TouristicSites",
      href: "/tourist/touristic-sites",
      icon: Home,
      current: true,
    },
    {
      name: "favorite sites",
      href: "/tourist/site-favorite",
      icon: Heart,
      current: false,
    },
    {
      name: "Events",
      href: "/tourist/tourist-event",
      icon: Calculator,
      current: false,
    },
    { name: "My Agents", href: "/agents", icon: Users, current: false },
    {
      name: "Appointments",
      href: "/appointments",
      icon: Calendar,
      current: false,
    },
    { name: "Messages", href: "/messages", icon: Mail, current: false },
  ],
  GUIDE: [
    { name: "Home", href: "/owner/properties", icon: Home, current: true },
    {
      name: "Properties",
      href: "/owner/properties",
      icon: Building2,
      current: false,
    },
    {
      name: "myProperties",
      href: "/owner/my-properties",
      icon: Building,
      current: false,
    },
    { name: "chats", href: "/leads", icon: UserPlus, current: false },
    {
      name: "Appointments",
      href: "/appointments",
      icon: Calendar,
      current: false,
    },
    {
      name: "Market Data",
      href: "/market-data",
      icon: TrendingUp,
      current: false,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      current: false,
    },
    { name: "Messages", href: "/messages", icon: Mail, current: false },
    { name: "Tools", href: "/tools", icon: Calculator, current: false },
    { name: "Reports", href: "/reports", icon: FileText, current: false },
  ],
  SITE_ADMIN: [
    {
      name: "Dashboard",
      href: "/siteadmin/dashboard",
      icon: Home,
      current: false,
    },
    {
      name: "TouristicSites",
      href: "/siteadmin/touristicSites",
      icon: Home,
      current: false,
    },
    {
      name: "mysite",
      href: "/siteadmin/mysite",
      icon: Building2,
      current: false,
    },
    {
      name: "Events",
      href: "/siteadmin/event",
      icon: Building,
      current: false,
    },
    {
      name: "Chats",
      href: "/siteadmin/chats",
      icon: Building,
      current: false,
    },
  ],
  ADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: Home, current: false },
    { name: "User Management", href: "/users", icon: Users, current: false },
    {
      name: "Property System",
      href: "/property-system",
      icon: Building2,
      current: false,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      current: false,
    },
    {
      name: "System Settings",
      href: "/system",
      icon: Database,
      current: false,
    },
    { name: "Security", href: "/security", icon: Shield, current: false },
    { name: "Reports", href: "/reports", icon: FileText, current: false },
    { name: "Billing", href: "/billing", icon: CreditCard, current: false },
    { name: "Support", href: "/support", icon: HelpCircle, current: false },
    { name: "Settings", href: "/settings", icon: Settings, current: false },
  ],
};
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [visibleLinks, setVisibleLinks] = useState([]);
  const [hiddenLinks, setHiddenLinks] = useState([]);
  const { logout } = useAuth();
  const navRef = useRef(null);
  const userDropdownRef = useRef(null);
  const moreDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const Navigate = useNavigate();
  // Real Estate role-based navigation configuration
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : { role: "SITE_ADMIN" };
  const navigationLinks = navigationConfig[user.role] || navigationConfig.USER;

  // User dropdown menu items
  const userMenuItems = [
    { name: "View Profile", href: "/profile", icon: User, type: "link" },
    {
      name: "Account Settings",
      href: "/account-settings",
      icon: Settings,
      type: "link",
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      badge: "3",
      type: "link",
    },
    { name: "Favorites", href: "/favorites", icon: Heart, type: "link" },
    { name: "Reviews", href: "/reviews", icon: Star, type: "link" },
    { name: "Help & Support", href: "/help", icon: HelpCircle, type: "link" },
    { type: "divider" },
    { name: "Sign Out", icon: LogOut, action: "logout", type: "action" },
  ];

  // Calculate which links fit in the available space
  const calculateVisibleLinks = React.useCallback(() => {
    if (window.innerWidth < 768) {
      // Mobile: all links go to mobile menu
      setVisibleLinks([]);
      setHiddenLinks(navigationLinks);
      return;
    }

    const navContainer = navRef.current;
    if (!navContainer) {
      setVisibleLinks(navigationLinks);
      setHiddenLinks([]);
      return;
    }

    const containerWidth = navContainer.offsetWidth;

    // Responsive breakpoints for link visibility - more conservative for real estate app
    let maxLinks;
    if (window.innerWidth >= 1536) maxLinks = 7; // 2xl
    else if (window.innerWidth >= 1280) maxLinks = 6; // xl
    else if (window.innerWidth >= 1024) maxLinks = 4; // lg
    else if (window.innerWidth >= 768) maxLinks = 3; // md
    else maxLinks = 0;

    // Further adjust based on container width
    if (containerWidth < 500) maxLinks = Math.min(maxLinks, 2);
    else if (containerWidth < 700) maxLinks = Math.min(maxLinks, 3);
    else if (containerWidth < 900) maxLinks = Math.min(maxLinks, 4);

    if (maxLinks >= navigationLinks.length) {
      setVisibleLinks(navigationLinks);
      setHiddenLinks([]);
    } else {
      setVisibleLinks(navigationLinks.slice(0, maxLinks));
      setHiddenLinks(navigationLinks.slice(maxLinks));
    }
  }, [navigationLinks]);

  useEffect(() => {
    calculateVisibleLinks();

    const handleResize = () => {
      calculateVisibleLinks();
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [calculateVisibleLinks]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target)
      ) {
        setIsMoreMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("[data-mobile-menu-button]")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeColor = (role) => {
    const colors = {
      ADMIN:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      OWNER:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
      USER: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    };
    return (
      colors[role] ||
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
    );
  };

  const handleNavigate = (href) => {
    onNavigate(href);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsMoreMenuOpen(false);
  };

  const handleUserMenuClick = async (item) => {
    if (item.action === "logout") {
      console.log("Logging out...");
      await logout();
      //redirect to login
      Navigate("/login");
    } else if (item.href) {
      handleNavigate(item.href);
    }
    setIsUserDropdownOpen(false);
  };

  const isDarkMode = false;

  const themeClasses = isDarkMode
    ? "bg-gray-900 border-gray-700"
    : "bg-white border-gray-200";

  return (
    <nav
      className={`${themeClasses} bg-white border-gray-200 border-b shadow-sm sticky top-0 z-50 transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center flex-1">
            {/* Mobile menu button */}
            <button
              data-mobile-menu-button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg mr-3 transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xl font-bold hidden sm:block ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                MboaTour
              </span>
            </div>

            {/* Desktop Navigation */}
            <div
              className="hidden md:flex items-center justify-center flex-1"
              ref={navRef}
            >
              <div className="flex items-center justify-evenly w-full max-w-4xl">
                {/* Visible Links */}
                {visibleLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      to={item.href}
                      key={item.name}
                      className={`flex-1 px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 whitespace-nowrap ${
                        isDarkMode
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* More Dropdown Menu */}
                {hiddenLinks.length > 0 && (
                  <div className="relative flex-1 mx-1" ref={moreDropdownRef}>
                    <button
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        isMoreMenuOpen
                          ? isDarkMode
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-900"
                          : isDarkMode
                          ? "text-gray-300 hover:text-white hover:bg-gray-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      <span>More</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isMoreMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isMoreMenuOpen && (
                      <div
                        className={`absolute left-0 mt-2 w-64 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 ${
                          isDarkMode ? "bg-gray-800 ring-gray-700" : "bg-white"
                        }`}
                      >
                        <div className="p-2">
                          <div
                            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Additional Options
                          </div>
                          {hiddenLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link to={item.href} key={item.name}>
                                <button
                                  key={item.name}
                                  onClick={() => handleNavigate(item.href)}
                                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                    item.current
                                      ? isDarkMode
                                        ? "bg-blue-600 text-white"
                                        : "bg-blue-600 text-white"
                                      : isDarkMode
                                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                  }`}
                                >
                                  <Icon className="w-4 h-4 mr-3" />
                                  <span>{item.name}</span>
                                </button>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Controls and User */}
          <div className="flex items-center space-x-3">
            {/* Notifications Bell */}
            <button
              className={`p-2 rounded-lg transition-colors duration-200 relative ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Role Badge */}
            <div className="hidden lg:block">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {user.role}
              </span>
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center space-x-2 p-1 rounded-lg transition-all duration-200 ${
                  isUserDropdownOpen
                    ? isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-900"
                    : isDarkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <img
                  className="w-8 h-8 rounded-full ring-2 ring-blue-500/20 shadow-sm"
                  src={user.avatar}
                  alt={user.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=2563eb&color=ffffff`;
                  }}
                />
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 hidden sm:block ${
                    isUserDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isUserDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 ${
                    isDarkMode ? "bg-gray-800 ring-gray-700" : "bg-white"
                  }`}
                >
                  {/* User Info Header */}
                  <div
                    className={`px-4 py-4 border-b ${
                      isDarkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        className="w-12 h-12 rounded-full ring-2 ring-blue-500/20"
                        src={user.avatar}
                        alt={user.name}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=2563eb&color=ffffff`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.name}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {user.email}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    {userMenuItems.map((item, index) => {
                      if (item.type === "divider") {
                        return (
                          <div
                            key={index}
                            className={`my-2 border-t ${
                              isDarkMode ? "border-gray-700" : "border-gray-100"
                            }`}
                          />
                        );
                      }

                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleUserMenuClick(item)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            item.action === "logout"
                              ? isDarkMode
                                ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                : "text-red-600 hover:bg-red-50 hover:text-red-700"
                              : isDarkMode
                              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <div className="flex items-center">
                            <Icon className="w-4 h-4 mr-3" />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={`md:hidden border-t ${
            isDarkMode
              ? "border-gray-700 bg-gray-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="px-4 py-3 space-y-1">
            {/* User Info */}
            <div
              className={`flex items-center space-x-3 px-3 py-3 rounded-xl mb-4 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <img
                className="w-12 h-12 rounded-full ring-2 ring-blue-500/20"
                src={user.avatar}
                alt={user.name}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=2563eb&color=ffffff`;
                }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={`text-xs truncate ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.email}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <p
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Navigation
              </p>
              {navigationLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    to={item.href}
                    key={item.name}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      item.current
                        ? isDarkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-600 text-white"
                        : isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div
              className={`pt-4 border-t space-y-1 ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <p
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Account
              </p>
              {userMenuItems.map((item, index) => {
                if (item.type === "divider") return null;

                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleUserMenuClick(item)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      item.action === "logout"
                        ? isDarkMode
                          ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                          : "text-red-600 hover:bg-red-50 hover:text-red-700"
                        : isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
