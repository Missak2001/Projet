// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setUsers, followUser, unfollowUser, setCurrentUser } from "/userSlice";
// import { addNotification } from "/notificationSlice";
// import { Link } from "react-router-dom";
// import axios from "axios";

// function UsersList() {
//   const dispatch = useDispatch();
//   const { users, currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const userId = parseInt(localStorage.getItem("userId"), 10);
//     axios.get("http://localhost:3000/users")
//       .then((response) => {
//         dispatch(setUsers(response.data));
//         const currentUserData = response.data.find(user => user.id === userId);
//         if (currentUserData) {
//           dispatch(setCurrentUser(currentUserData));
//         }
//       })
//       .catch((error) => {
//         console.error("Erreur lors de la récupération des utilisateurs", error);
//       });
//   }, [dispatch]);

//   const handleFollow = (userId) => {
//     if (currentUser && !currentUser.followedUsers.includes(userId)) {
//       console.log("Handle Follow:", userId);
//       dispatch(followUser({ userId: currentUser.id, followedUserId: userId }));
//       const updatedUser = { ...currentUser, followedUsers: [...currentUser.followedUsers, userId] };
//       dispatch(setCurrentUser(updatedUser));

//       axios.post('http://localhost:3000/notifications', {
//         recipientId: userId,
//         message: `${currentUser.firstName} vous a suivi !`,
//         isRead: false,
//       })
//         .then(() => {
//           dispatch(addNotification({ message: `${currentUser.firstName} vous a suivi !`, userId }));
//         })
//         .catch((error) => console.error('Erreur de notification:', error));
//     }
//   };

//   const handleUnfollow = (userId) => {
//     if (currentUser && currentUser.followedUsers.includes(userId)) {
//       console.log("Handle Unfollow:", userId);
//       dispatch(unfollowUser({ userId: currentUser.id, unfollowedUserId: userId }));
//       const updatedUser = { ...currentUser, followedUsers: currentUser.followedUsers.filter(id => id !== userId) };
//       dispatch(setCurrentUser(updatedUser));

//       axios.post('http://localhost:3000/notifications', {
//         recipientId: userId,
//         message: `${currentUser.firstName} vous a unfollow !`,
//         isRead: false,
//       })
//         .then(() => {
//           dispatch(addNotification({ message: `${currentUser.firstName} vous a unfollow !`, userId }));
//         })
//         .catch((error) => console.error('Erreur de notification:', error));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12">
//       <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Tous les utilisateurs</h1>

//       <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
//         {users.length === 0 ? (
//           <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>
//         ) : (
//           <div className="space-y-6">
//             {users.map((user) => (
//               user.id !== currentUser?.id && (
//                 <div
//                   key={user.id}
//                   className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="text-center">
//                       <p className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
//                       <p className="text-sm text-gray-600">{user.email}</p>
//                     </div>
//                   </div>

//                   <div className="flex space-x-4">
//                     <Link
//                       to={`/profile/${user.id}`}
//                       className="text-blue-500 hover:underline font-medium"
//                     >
//                       Voir le profil
//                     </Link>

//                     {currentUser.followedUsers?.includes(user.id) ? (
//                       <button
//                         onClick={() => handleUnfollow(user.id)}
//                         className="bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-red-700"
//                       >
//                         Ne plus suivre
//                       </button>
//                     ) : (
//                       <button
//                         onClick={() => handleFollow(user.id)}
//                         className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-blue-700"
//                       >
//                         Suivre
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UsersList;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, followUser, unfollowUser, setCurrentUser } from "/userSlice";
import axios from "axios";
import { Link } from 'react-router-dom'; // Cette ligne doit être présente

function UsersList() {
  const dispatch = useDispatch();
  const { users, currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const userId = parseInt(localStorage.getItem("userId"), 10);
    axios.get("http://localhost:3000/users")
      .then((response) => {
        dispatch(setUsers(response.data));
        const currentUserData = response.data.find(user => user.id === userId);
        if (currentUserData) {
          dispatch(setCurrentUser(currentUserData));
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      });
  }, [dispatch]);

  const handleFollow = (userId) => {
    if (currentUser && !currentUser.followedUsers.includes(userId)) {
      dispatch(followUser({ userId: currentUser.id, followedUserId: userId }));

      // Mettre à jour currentUser localement pour refléter immédiatement le changement dans l'UI
      dispatch(setCurrentUser({
        ...currentUser,
        followedUsers: [...currentUser.followedUsers, userId],
      }));
    }
  };

  const handleUnfollow = (userId) => {
    if (currentUser && currentUser.followedUsers.includes(userId)) {
      dispatch(unfollowUser({ userId: currentUser.id, unfollowedUserId: userId }));

      // Mettre à jour currentUser localement pour refléter immédiatement le changement dans l'UI
      dispatch(setCurrentUser({
        ...currentUser,
        followedUsers: currentUser.followedUsers.filter(id => id !== userId),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12">
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Tous les utilisateurs</h1>

      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>
        ) : (
          <div className="space-y-6">
            {users.map((user) => (
              user.id !== currentUser?.id && (
                <div
                  key={user.id}
                  className="flex justify-between items-center bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      to={`/profile/${user.id}`}
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Voir le profil
                    </Link>

                    {currentUser.followedUsers?.includes(user.id) ? (
                      <button
                        onClick={() => handleUnfollow(user.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full"
                      >
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(user.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full"
                      >
                        Follow
                      </button>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersList;
