import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/users/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du profil", error);
      });
  }, [userId]);

  if (!user) return <p className="text-center text-xl">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        
        {/* Bouton Retour */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
        >
          ← Retour
        </button>

        <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">
          Profil de {user.firstName} {user.lastName}
        </h1>
        <p className="text-lg text-gray-700"><strong>Email :</strong> {user.email}</p>
        <p className="text-lg text-gray-700"><strong>Nom :</strong> {user.lastName}</p>
        <p className="text-lg text-gray-700"><strong>Prénom :</strong> {user.firstName}</p>
      </div>
    </div>
  );
}

export default UserProfile;

