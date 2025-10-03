import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./services/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
