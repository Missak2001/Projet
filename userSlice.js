// import { createSlice } from '@reduxjs/toolkit';

// const userSlice = createSlice({
//   name: 'user',
//   initialState: {
//     users: [],
//     currentUser: null,
//   },
//   reducers: {
//     setUsers: (state, action) => {
//       // Initialisez `followedUsers` si ce n'est pas déjà fait
//       state.users = action.payload.map(user => ({
//         ...user,
//         followedUsers: user.followedUsers || [] // Ajoutez ceci si non défini
//       }));
//     },
//     setCurrentUser: (state, action) => {
//       state.currentUser = action.payload;
//     },
//     followUser: (state, action) => {
//       const { userId, followedUserId } = action.payload;
//       const currentUser = state.users.find((user) => user.id === userId);
//       if (currentUser && !currentUser.followedUsers.includes(followedUserId)) {
//         currentUser.followedUsers.push(followedUserId);
//       }
//     },
//     unfollowUser: (state, action) => {
//       const { userId, unfollowedUserId } = action.payload;
//       const currentUser = state.users.find((user) => user.id === userId);
//       if (currentUser) {
//         currentUser.followedUsers = currentUser.followedUsers.filter(
//           (id) => id !== unfollowedUserId
//         );
//       }
//     },
//   },
// });

// export const { setUsers, setCurrentUser, followUser, unfollowUser } = userSlice.actions;
// export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    currentUser: null,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload.map(user => ({
        ...user,
        followedUsers: user.followedUsers || [], // Si suivi non défini
      }));
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    followUser: (state, action) => {
      const { userId, followedUserId } = action.payload;
      const currentUser = state.users.find((user) => user.id === userId);

      if (currentUser && !currentUser.followedUsers.includes(followedUserId)) {
        currentUser.followedUsers.push(followedUserId);

        // Mise à jour du backend (en arrière-plan)
        axios.patch(`http://localhost:3000/users/${userId}`, {
          followedUsers: currentUser.followedUsers,
        })
        .catch((error) => {
          console.error("Erreur de mise à jour de l'utilisateur :", error);
        });
      }
    },
    unfollowUser: (state, action) => {
      const { userId, unfollowedUserId } = action.payload;
      const currentUser = state.users.find((user) => user.id === userId);

      if (currentUser) {
        currentUser.followedUsers = currentUser.followedUsers.filter(
          (id) => id !== unfollowedUserId
        );

        // Mise à jour du backend (en arrière-plan)
        axios.patch(`http://localhost:3000/users/${userId}`, {
          followedUsers: currentUser.followedUsers,
        })
        .catch((error) => {
          console.error("Erreur de mise à jour de l'utilisateur :", error);
        });
      }
    },
  },
});

export const { setUsers, setCurrentUser, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;
