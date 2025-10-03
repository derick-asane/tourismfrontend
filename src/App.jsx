import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 ">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
