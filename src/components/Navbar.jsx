import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiTwitter, FiLogOut, FiMenu, FiX } from "react-icons/fi"; // FiUsers n'est plus importé ici

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (!token) return null;  // Si le token n'existe pas, ne pas afficher la barre de navigation

  return (
    <div>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <nav
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 p-6 space-y-6 transform transition-transform duration-300 shadow-lg ${
          menuOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:w-72 md:p-8 md:flex md:flex-col md:justify-start`}
      >
        <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center">
          <FiTwitter className="text-blue-500 mr-2" size={28} />
          Twitter Clone
        </h1>

        <Link to="/feed" className="flex items-center text-lg hover:text-blue-400 transition">
          <FiHome className="mr-2" size={22} /> Fil d'actualité
        </Link>
        <Link to="/profile" className="flex items-center text-lg hover:text-blue-400 transition">
          <FiUser className="mr-2" size={22} /> Profil
        </Link>
        <Link to="/tweets" className="flex items-center text-lg hover:text-blue-400 transition">
          📝 Mes Tweets
        </Link>
        <Link to="/users" className="flex items-center text-lg hover:text-blue-400 transition">
          <FiUser className="mr-2" size={22} /> Utilisateurs
        </Link>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-lg transition"
        >
          <FiLogOut className="mr-2" size={22} /> Déconnexion
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
