import React, { useState, useEffect } from "react";
import axios from "axios";
import { XCircle } from "lucide-react";

function Feed() {
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState({});
  const [newTweet, setNewTweet] = useState("");
  const [commentIdCounter, setCommentIdCounter] = useState(1);
  const [notifications, setNotifications] = useState([]);

  const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

  useEffect(() => {
    fetchTweets();
    fetchUsers();
    fetchNotifications(); // Charger les notifications au démarrage
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tweets");
      setTweets(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des tweets :", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const usersMap = response.data.reduce((acc, user) => {
        acc[user.id] = user.firstName + " " + user.lastName;
        return acc;
      }, {});
      setUsers(usersMap);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/notifications?recipientId=${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications", error);
    }
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (!newTweet.trim() || !userId) return;

    try {
      const response = await axios.post("http://localhost:3000/tweets", {
        content: newTweet.trim(),
        userId: userId,
        createdAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],  // Initialisation des likes avec un tableau vide
        comments: [] // Initialisation des commentaires vides
      });
      setTweets([response.data, ...tweets]);
      setNewTweet(""); // Réinitialisation du champ de texte
    } catch (error) {
      console.error("Erreur lors de l'envoi du tweet :", error);
    }
  };

  const handleCommentSubmit = async (tweetId, newCommentContent) => {
    try {
      const newComment = {
        content: newCommentContent,
        userId: userId,
        createdAt: new Date().toISOString(),
        likes: 0,
        likedBy: [], // Initialisation des likes avec un tableau vide
        id: commentIdCounter,  // Utilisation de l'ID incrémentiel
      };

      const tweetToUpdate = tweets.find((tweet) => tweet.id === tweetId);
      tweetToUpdate.comments.push(newComment);

      setCommentIdCounter(commentIdCounter + 1);

      const response = await axios.patch(`http://localhost:3000/tweets/${tweetId}`, tweetToUpdate);
      setTweets(tweets.map(tweet => tweet.id === tweetId ? response.data : tweet));
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    }
  };

  const handleDeleteComment = async (tweetId, commentId) => {
    try {
      const tweetToUpdate = tweets.find((tweet) => tweet.id === tweetId);
      const updatedComments = tweetToUpdate.comments.filter(comment => comment.id !== commentId);
      tweetToUpdate.comments = updatedComments;

      const response = await axios.patch(`http://localhost:3000/tweets/${tweetId}`, tweetToUpdate);
      setTweets(tweets.map(tweet => tweet.id === tweetId ? response.data : tweet));
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
    }
  };

  const handleLikeTweet = async (tweetId) => {
    try {
      const tweetToUpdate = tweets.find((tweet) => tweet.id === tweetId);

      // Vérification que likedBy est un tableau avant d'utiliser .includes
      if (Array.isArray(tweetToUpdate.likedBy) && !tweetToUpdate.likedBy.includes(userId)) {
        tweetToUpdate.likedBy.push(userId);
        tweetToUpdate.likes++;
      } else if (Array.isArray(tweetToUpdate.likedBy)) {
        tweetToUpdate.likedBy = tweetToUpdate.likedBy.filter(id => id !== userId);
        tweetToUpdate.likes--;
      }

      const response = await axios.patch(`http://localhost:3000/tweets/${tweetId}`, tweetToUpdate);
      setTweets(tweets.map(tweet => tweet.id === tweetId ? response.data : tweet));
    } catch (error) {
      console.error("Erreur lors du like du tweet :", error);
    }
  };

  const handleLikeComment = async (tweetId, commentId) => {
    try {
      const tweetToUpdate = tweets.find((tweet) => tweet.id === tweetId);
      const commentToUpdate = tweetToUpdate.comments.find(comment => comment.id === commentId);

      // Vérification que likedBy est un tableau avant d'utiliser .includes
      if (Array.isArray(commentToUpdate.likedBy) && !commentToUpdate.likedBy.includes(userId)) {
        commentToUpdate.likedBy.push(userId);
        commentToUpdate.likes++;
      } else if (Array.isArray(commentToUpdate.likedBy)) {
        commentToUpdate.likedBy = commentToUpdate.likedBy.filter(id => id !== userId);
        commentToUpdate.likes--;
      }

      const response = await axios.patch(`http://localhost:3000/tweets/${tweetId}`, tweetToUpdate);
      setTweets(tweets.map(tweet => tweet.id === tweetId ? response.data : tweet));
    } catch (error) {
      console.error("Erreur lors du like du commentaire :", error);
    }
  };

  // Nouvelle fonction pour marquer comme lue et supprimer la notification
  const handleMarkAsReadAndDeleteNotification = (notificationId) => {
    axios.patch(`http://localhost:3000/notifications/${notificationId}`, { isRead: true })
      .then(() => {
        // Supprimer la notification du backend
        return axios.delete(`http://localhost:3000/notifications/${notificationId}`);
      })
      .then(() => {
        // Supprimer la notification du state local
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
        console.log("Notification marquée comme lue et supprimée.");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour ou suppression de la notification", error);
      });
  };

  if (!userId) {
    return <p className="text-center text-red-500">Vous devez être connecté pour voir le fil d'actualité.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold">Créer un tweet</h2>
        <form onSubmit={handleTweetSubmit} className="mt-4">
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="Quoi de neuf ?"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-3 w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
            disabled={!newTweet.trim()}
          >
            Tweeter
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {notifications.length === 0 ? (
          <p>Aucune notification pour le moment.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-3 mb-2 rounded-lg ${notification.isRead ? 'bg-gray-200' : 'bg-blue-100'}`}
              >
                <p>{notification.message}</p>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsReadAndDeleteNotification(notification.id)}
                    className="text-blue-500 hover:text-blue-700 mt-2 text-sm"
                  >
                    Marquer comme lu et supprimer
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4">
        {tweets && tweets.length > 0 ? (
          tweets.map((tweet) => (
            <div key={tweet.id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg">{tweet.content}</p>
              <div className="mt-3 border-t pt-2 flex flex-col sm:flex-row sm:justify-between text-gray-500 text-sm">
                <span className="font-semibold">{users[tweet.userId] || "Utilisateur inconnu"}</span>
                <span>{new Date(tweet.createdAt).toLocaleString()}</span>
              </div>

              <div className="mt-4">
                {tweet.comments && tweet.comments.length > 0 ? (
                  tweet.comments.map((comment) => (
                    <div key={comment.id} className="border-t pt-3">
                      <p>{comment.content}</p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLikeComment(tweet.id, comment.id)}
                          className={`text-blue-500 hover:text-blue-700 ${Array.isArray(comment.likedBy) && comment.likedBy.includes(userId) ? 'font-bold' : ''}`}
                        >
                          {Array.isArray(comment.likedBy) && comment.likedBy.includes(userId) ? 'Annuler le like' : 'Like'}
                        </button>
                        <span>{comment.likes} Likes</span>

                        <button
                          onClick={() => handleDeleteComment(tweet.id, comment.id)}
                          className="text-red-500 hover:text-red-700 ml-4"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Aucun commentaire pour ce tweet.</p>
                )}
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Ajouter un commentaire..."
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCommentSubmit(tweet.id, e.target.value);
                      e.target.value = ""; // Réinitialiser le champ de texte après l'envoi
                    }
                  }}
                />
              </div>

              <div className="mt-3 flex items-center">
                <button
                  onClick={() => handleLikeTweet(tweet.id)}
                  className={`text-blue-500 hover:text-blue-700 ${Array.isArray(tweet.likedBy) && tweet.likedBy.includes(userId) ? 'font-bold' : ''}`}
                >
                  {Array.isArray(tweet.likedBy) && tweet.likedBy.includes(userId) ? 'Annuler le like' : 'Like'}
                </button>
                <span className="ml-2">{tweet.likes} Likes</span>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun tweet trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default Feed;
