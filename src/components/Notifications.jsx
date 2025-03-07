import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, markAsRead, removeNotification } from "/notificationSlice"; 
import axios from "axios";

function Notifications() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification); // Assurez-vous que vous récupérez correctement les notifications

  useEffect(() => {
    // Optionnel : récupérez les notifications au chargement du composant
    axios.get("http://localhost:3000/notifications")
      .then((response) => {
        // Mettre à jour l'état Redux avec les notifications existantes
        response.data.forEach((notification) => {
          dispatch(addNotification(notification)); 
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des notifications", error);
      });
  }, [dispatch]);

  const markAsReadAndRemove = (notificationId) => {
    // Mettre à jour la notification comme lue sur le serveur
    axios.patch(`http://localhost:3000/notifications/${notificationId}`, { isRead: true })
      .then(() => {
        // Marquer comme lue localement
        dispatch(markAsRead(notificationId));

        // Supprimer la notification localement après qu'elle ait été marquée comme lue
        dispatch(removeNotification(notificationId));

        console.log("Notification marquée comme lue et supprimée");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de la notification", error);
      });
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
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
                  onClick={() => markAsReadAndRemove(notification.id)}
                  className="text-blue-500 hover:text-blue-700 mt-2 text-sm"
                >
                  Marquer comme lu
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
