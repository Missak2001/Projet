import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

  if (!userId) {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
    return <Navigate to="/login" />;
  }

  return children; // Si l'utilisateur est authentifié, afficher la page
};

export default AuthGuard;
