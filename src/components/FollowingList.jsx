import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Importer useNavigate

function FollowingList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); // Initialiser la navigation

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then((response) => {
        const userId = parseInt(localStorage.getItem("userId"), 10);
        setUsers(response.data);
        setCurrentUser(response.data.find((user) => user.id === userId));
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      });
  }, []);

  if (!currentUser) return <p className="text-center text-xl">Chargement...</p>;

  const following = users.filter(user => currentUser.followedUsers?.includes(user.id));

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      {/* Bouton Retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        ← Retour
      </button>

      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Utilisateurs que je suis
      </h1>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        {following.length === 0 ? (
          <p className="text-gray-500">Vous ne suivez personne pour le moment.</p>
        ) : (
          following.map((user) => (
            <div key={user.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
              <div>
                <p className="text-lg font-semibold text-gray-800">Nom : {user.lastName}</p>
                <p className="text-lg font-semibold text-gray-800">Prénom : {user.firstName}</p>
              </div>
              <Link to={`/profile/${user.id}`} className="text-blue-500 hover:underline">
                Voir le profil
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FollowingList;
