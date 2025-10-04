import React from "react";
import App from "./App";
import LandingPage from "./pages/LandingPage";

import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import TourGuideDashboard from "./pages/tourguide/TourguideDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TouristHome from "./pages/tourist/TouristHome";
import TouristicSite from "./pages/tourist/TouristicSites";
import AdminSiteTouristicSite from "./pages/siteadmin/SiteAdminTouristicSite";
import SiteAdminEvent from "./pages/siteadmin/SiteAdminEvent";
import TourGuideEvent from "./pages/tourguide/TourGuideEvent";
import TouristEventPage from "./pages/tourist/TouristEventPage";
import AIDiagnosis from "./pages/tourist/AIDiagnosis";

const routes = [
  {
    path: "/tourist",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <TouristHome />,
      },
      {
        path: "touristic-sites",
        element: <TouristicSite />,
      },
      {
        path: "tourist-event",
        element: <TouristEventPage />,
      },
      {
        path: "tourist-ai",
        element: <AIDiagnosis />,
      },
    ],
  },
  {
    path: "/tourguide",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <TourGuideDashboard /> },
      {
        path: "event",
        element: <TourGuideEvent />,
      },
    ],
  },
  {
    path: "/admin",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: "dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "/siteadmin",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, path: "mysite", element: <AdminSiteTouristicSite /> },
      { path: "event", element: <SiteAdminEvent /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
];

const router = createBrowserRouter(routes);

export default router;
