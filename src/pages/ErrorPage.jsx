import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
  Mail,
  Phone,
  Wifi,
  WifiOff,
  Server,
  Clock,
  Shield,
  Bug,
  Plane,
  Mountain,
  Waves,
  Cloud,
  Sun,
  MapPin,
  Search,
  Settings,
  Info,
  CheckCircle,
} from "lucide-react";

const ErrorPage = () => {
  const [errorType, setErrorType] = useState("general");
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const errorTypes = {
    general: {
      icon: AlertTriangle,
      title: "Oops! Something Went Wrong",
      subtitle: "We encountered an unexpected error during your journey",
      color: "from-red-500 to-pink-600",
      bgColor: "from-red-50 to-pink-50",
    },
    network: {
      icon: WifiOff,
      title: "Connection Lost",
      subtitle: "Unable to connect to our travel servers",
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50",
    },
    server: {
      icon: Server,
      title: "Server Temporarily Unavailable",
      subtitle: "Our servers are taking a quick break",
      color: "from-purple-500 to-indigo-600",
      bgColor: "from-purple-50 to-indigo-50",
    },
    timeout: {
      icon: Clock,
      title: "Request Timed Out",
      subtitle: "The request took too long to complete",
      color: "from-yellow-500 to-orange-600",
      bgColor: "from-yellow-50 to-orange-50",
    },
    permission: {
      icon: Shield,
      title: "Access Denied",
      subtitle: "You don't have permission to access this page",
      color: "from-gray-500 to-gray-700",
      bgColor: "from-gray-50 to-gray-100",
    },
  };

  const troubleshootingSteps = [
    { icon: RefreshCw, text: "Try refreshing the page" },
    { icon: Wifi, text: "Check your internet connection" },
    { icon: Settings, text: "Clear your browser cache" },
    { icon: Phone, text: "Contact our support team" },
  ];

  const currentError = errorTypes[errorType];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % troubleshootingSteps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  const handleReportError = () => {
    // Error reporting logic would go here
    alert("Error report submitted! Thank you for helping us improve.");
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentError.bgColor} relative overflow-hidden`}
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 opacity-5">
          <Plane className="h-32 w-32 text-gray-600 animate-pulse" />
        </div>
        <div className="absolute top-1/4 right-20 opacity-5">
          <Mountain className="h-40 w-40 text-gray-600" />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-5">
          <Waves className="h-36 w-36 text-gray-600" />
        </div>
        <div className="absolute top-1/3 right-1/3 opacity-3">
          <Sun className="h-48 w-48 text-gray-500" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 opacity-5">
          <Cloud className="h-28 w-28 text-gray-600" />
        </div>
      </div>

      {/* Error Type Selector (for demo purposes) */}
      <div className="absolute top-4 right-4 z-20">
        <select
          value={errorType}
          onChange={(e) => setErrorType(e.target.value)}
          className="bg-white/90 backdrop-blur border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="general">General Error</option>
          <option value="network">Network Error</option>
          <option value="server">Server Error</option>
          <option value="timeout">Timeout Error</option>
          <option value="permission">Permission Error</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Icon and Animation */}
          <div className="mb-8">
            <div
              className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${currentError.color} mb-6 animate-pulse`}
            >
              <currentError.icon className="h-16 w-16 text-white" />
            </div>
            <div className="flex justify-center space-x-2">
              <div
                className="w-3 h-3 bg-red-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              {currentError.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              {currentError.subtitle}
            </p>

            {/* Error Code (if applicable) */}
            <div className="inline-flex items-center bg-gray-100 px-4 py-2 rounded-full">
              <Bug className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-mono text-gray-700">
                Error Code: ERR_{errorType.toUpperCase()}_001
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className={`group bg-gradient-to-r ${
                currentError.color
              } text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center ${
                isRetrying ? "opacity-75" : ""
              }`}
            >
              <RefreshCw
                className={`mr-2 h-5 w-5 ${
                  isRetrying ? "animate-spin" : "group-hover:rotate-180"
                } transition-transform`}
              />
              {isRetrying ? "Retrying..." : "Try Again"}
            </button>

            <button className="group bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center">
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Back to Home
            </button>

            <button className="group bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center">
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>

          {/* Troubleshooting Steps */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/20 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center">
              <Settings className="mr-2 h-6 w-6" />
              Quick Fixes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {troubleshootingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    index === currentStep
                      ? "bg-blue-100 border-2 border-blue-300 scale-105"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`p-3 rounded-full mb-3 ${
                        index === currentStep ? "bg-blue-200" : "bg-gray-200"
                      }`}
                    >
                      <step.icon
                        className={`h-6 w-6 ${
                          index === currentStep
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      {step.text}
                    </p>
                    {index === currentStep && (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Details & Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Error Details */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Info className="mr-2 h-5 w-5" />
                What Happened?
              </h4>
              <div className="text-left space-y-2 text-gray-600">
                <p>• Timestamp: {new Date().toLocaleString()}</p>
                <p>• Browser: {navigator.userAgent.split(" ")[0]}</p>
                <p>• Page: /current-page-url</p>
                <p>• User ID: user_12345</p>
              </div>
              <button
                onClick={handleReportError}
                className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center"
              >
                <Bug className="mr-2 h-4 w-4" />
                Report This Error
              </button>
            </div>

            {/* Contact Support */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Need Help?
              </h4>
              <p className="text-gray-600 mb-4">
                Our support team is available 24/7 to help you get back on
                track.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Support: 1-800-TRAVEL
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email: support@travelwise.com
                </button>
              </div>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">While You're Here...</h3>
            <p className="text-blue-100 mb-6">
              Why not explore some of our popular features?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center">
                <Search className="mr-2 h-4 w-4" />
                Search Destinations
              </button>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center">
                <MapPin className="mr-2 h-4 w-4" />
                Browse Popular Places
              </button>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center">
                <Plane className="mr-2 h-4 w-4" />
                Flight Deals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
