import React, { useState } from "react";
import axios from "axios";
import {
  Bot,
  Send,
  Loader2,
  MessageSquareWarning,
  Sparkles,
} from "lucide-react"; // Added Sparkles for a touch of AI magic

// Assume BASE_URL is defined somewhere globally or as an environment variable
// For local development, it might be 'http://localhost:3000'
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const AIDiagnosis = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askAI = async () => {
    if (!prompt.trim()) {
      setError("Please enter a question to ask the AI.");
      return;
    }

    setLoading(true);
    setResponse("");
    setError(null);

    try {
      const res = await axios.post(`${BASE_URL}/ai/ask`, { prompt });
      setResponse(res.data.generatedText || "No response received from AI.");
    } catch (err) {
      console.error("Error asking AI:", err);
      setError(
        err.response?.data?.message ||
          "Failed to get a response from the AI. Please try again."
      );
      setResponse(""); // Clear any previous response on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
        {/* Left Side: Branding/Illustration */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-center items-center text-center md:w-1/3 min-h-[150px] md:min-h-[auto] md:py-12">
          <Sparkles className="h-16 w-16 mb-4 text-blue-200" />{" "}
          {/* Changed icon and color */}
          <h2 className="text-2xl font-bold mb-2">AI Assistant</h2>
          <p className="text-sm opacity-80">
            Your intelligent companion for quick answers.
          </p>
        </div>

        {/* Right Side: AI Interaction Form */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col space-y-6">
          <div className="flex items-center text-gray-800">
            <Bot className="h-7 w-7 mr-3 text-blue-600" />
            <h3 className="text-2xl font-semibold">Ask the AI</h3>
          </div>

          {/* Prompt Input */}
          <div>
            <label
              htmlFor="ai-prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Question
            </label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., What are the common symptoms of a migraine?"
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y text-gray-800 shadow-sm hover:border-gray-400"
              disabled={loading}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={askAI}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-3" />
            ) : (
              <Send className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" />
            )}
            {loading ? "Asking AI..." : "Ask AI"}
          </button>

          {/* AI Response / Feedback Area */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Bot className="h-5 w-5 mr-2 text-blue-600" />
              AI's Response
            </h4>

            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg flex items-start shadow-sm animate-fade-in">
                <MessageSquareWarning className="h-5 w-5 mr-3 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {!error && loading && (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-center shadow-sm animate-pulse-fade">
                <Loader2 className="animate-spin h-5 w-5 mr-3" />
                <p>Waiting for AI's response...</p>
              </div>
            )}

            {!error && !loading && response && (
              <div className="bg-gray-50 text-gray-800 p-4 rounded-lg shadow-sm animate-fade-in">
                <p className="leading-relaxed whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            )}

            {!error && !loading && !response && (
              <div className="bg-gray-50 text-gray-500 p-4 rounded-lg shadow-sm animate-fade-in">
                <p>Your AI response will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosis;
