import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Plane,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Plane className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">TravelWise</h3>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Discover the world's most beautiful destinations with our curated
              travel experiences. Your adventure begins here.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-blue-600 hover:bg-blue-500 p-2 rounded-full transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-blue-400 hover:bg-blue-300 p-2 rounded-full transition-colors duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-pink-600 hover:bg-pink-500 p-2 rounded-full transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-red-600 hover:bg-red-500 p-2 rounded-full transition-colors duration-300"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-200">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Travel Packages
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Hotels
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Activities
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Travel Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-200">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Booking Help
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Cancellation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Travel Insurance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  Safety Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-200">
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <div className="text-blue-100">
                  <p>123 Travel Street</p>
                  <p>Adventure City, AC 12345</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3" />
                <a
                  href="tel:+1234567890"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  +1 (234) 567-8900
                </a>
              </div>

              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3" />
                <a
                  href="mailto:info@travelwise.com"
                  className="text-blue-100 hover:text-white transition-colors duration-200"
                >
                  info@travelwise.com
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h5 className="text-sm font-semibold mb-3 text-blue-200">
                Subscribe to Newsletter
              </h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
                <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-r-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 TravelWise. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
