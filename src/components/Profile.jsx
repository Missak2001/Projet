import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [followersCount, setFollowersCount] = useState(0); // Compte des followers
  const [followingCount, setFollowingCount] = useState(0); // Compte des suivis
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserData(response.data);
        // Calculer le nombre de followers
        const followers = response.data.followers || [];
        setFollowersCount(followers.length);

        // Calculer le nombre de personnes suivies
        const following = response.data.followedUsers || [];
        setFollowingCount(following.length);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données de l'utilisateur", error);
        navigate("/login"); // Rediriger vers login si une erreur survient
      });
  }, [navigate, token, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleNavigateToFollowers = () => {
    navigate("/followersList"); // Redirige vers la page des followers
  };

  const handleNavigateToFollowing = () => {
    navigate("/followingList"); // Redirige vers la page des suivis
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6">
          Profil de {userData ? `${userData.firstName} ${userData.lastName}` : "l'utilisateur"}
        </h2>

        {userData ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-semibold text-lg">Nom :</p>
              <p>{userData.lastName}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-lg">Prénom :</p>
              <p>{userData.firstName}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-lg">Email :</p>
              <p>{userData.email}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-lg">Téléphone :</p>
              <p>{userData.phone}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold text-lg">Adresse :</p>
              <p>{userData.address}</p>
            </div>

            {/* Affichage des cases Followers et Following */}
            <div className="flex justify-between mt-6">
              <div
                onClick={handleNavigateToFollowers}
                className="flex items-center cursor-pointer bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-600 transition"
              >
                <div className="mr-4">
                  <p className="text-2xl font-bold">{followersCount}</p>
                  <p className="text-lg">Mes Followers</p>
                </div>
              </div>

              <div
                onClick={handleNavigateToFollowing}
                className="flex items-center cursor-pointer bg-green-500 text-white p-4 rounded-lg shadow-lg hover:bg-green-600 transition"
              >
                <div className="mr-4">
                  <p className="text-2xl font-bold">{followingCount}</p>
                  <p className="text-lg">Les personnes que je suis</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Chargement...</p>
        )}

      </div>
    </div>
  );
}

export default Profile;
