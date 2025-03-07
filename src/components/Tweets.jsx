import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tweets() {
  const [tweets, setTweets] = useState([]);
  const [newTweetContent, setNewTweetContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTweetId, setEditingTweetId] = useState(null); // Pour suivre le tweet en cours d'édition
  const [editContent, setEditContent] = useState(""); // Contenu du tweet à modifier
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    setLoading(true);

    axios
      .get(`http://localhost:3000/tweets?userId=${userId}`)
      .then((response) => {
        setTweets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tweets", error);
        setLoading(false);
        alert("Erreur lors de la récupération des tweets.");
      });
  }, [navigate]);

  const handleTweetPost = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Utilisateur non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    if (!newTweetContent.trim()) {
      alert("Le tweet ne peut pas être vide");
      return;
    }

    setLoading(true);

    axios
      .post("http://localhost:3000/tweets", {
        content: newTweetContent.trim(),
        userId: userId,
        createdAt: new Date().toISOString(),
        likes: 0, // Ajout de la propriété likes initialisée à 0
        likedBy: [], // Ajout de la propriété likedBy initialisée à un tableau vide
      })
      .then((response) => {
        setTweets([response.data, ...tweets]);
        setNewTweetContent("");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erreur lors de l'envoi du tweet", error);
        alert("Une erreur est survenue lors de l'envoi du tweet.");
      });
  };

  const handleDeleteTweet = (tweetId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Utilisateur non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .delete(`http://localhost:3000/tweets/${tweetId}`)
      .then(() => {
        setTweets(tweets.filter((tweet) => tweet.id !== tweetId));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du tweet", error);
        setLoading(false);
        alert("Erreur lors de la suppression du tweet.");
      });
  };

  const handleEditTweet = (tweetId) => {
    setEditingTweetId(tweetId); // Définir l'ID du tweet à modifier
    const tweetToEdit = tweets.find((tweet) => tweet.id === tweetId);
    setEditContent(tweetToEdit.content); // Remplir le champ de texte avec le contenu du tweet
  };

  const handleSaveEdit = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Utilisateur non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    if (!editContent.trim()) {
      alert("Le tweet ne peut pas être vide");
      return;
    }

    setLoading(true);
    axios
      .put(`http://localhost:3000/tweets/${editingTweetId}`, {
        content: editContent.trim(),
        userId: userId,
        createdAt: new Date().toISOString(),
      })
      .then(() => {
        setTweets(
          tweets.map((tweet) =>
            tweet.id === editingTweetId ? { ...tweet, content: editContent.trim() } : tweet
          )
        );
        setLoading(false);
        setEditingTweetId(null); // Réinitialiser l'état après la sauvegarde
        setEditContent(""); // Réinitialiser le contenu
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour du tweet", error);
        setLoading(false);
        alert("Erreur lors de la mise à jour du tweet.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">Mes Tweets</h2>

      {/* Formulaire pour créer un tweet */}
      <form onSubmit={handleTweetPost}>
        <textarea
          value={newTweetContent}
          onChange={(e) => setNewTweetContent(e.target.value)}
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Nouveau tweet..."
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white p-2 rounded"
          disabled={loading || !newTweetContent.trim()}
        >
          {loading ? "Envoi en cours..." : "Tweeter"}
        </button>
      </form>

      {/* Affichage des tweets */}
      {loading ? (
        <p>Chargement des tweets...</p>
      ) : (
        <div>
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200"
              >
                <p className="text-lg mb-2">{tweet.content}</p>
                <small className="text-gray-500 mb-2">
                  {new Date(tweet.createdAt).toLocaleString()}
                </small>

                {/* Affichage du nombre de likes */}
                <div className="flex justify-between mt-2">
                  <span className="text-gray-700">
                    {tweet.likes} {tweet.likes === 1 ? "like" : "likes"}
                  </span>
                </div>

                {/* Boutons pour modifier et supprimer */}
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleEditTweet(tweet.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteTweet(tweet.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>

                {/* Formulaire de modification de tweet */}
                {editingTweetId === tweet.id && (
                  <div className="mt-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="4"
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={handleSaveEdit}
                      disabled={loading || !editContent.trim()}
                      className="mt-2 w-full bg-blue-500 text-white p-2 rounded-lg disabled:bg-gray-300"
                    >
                      Sauvegarder
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Aucun tweet à afficher</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Tweets;
