import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';  // Le slice qui gère l'utilisateur
import notificationReducer from './notificationSlice';  // Le slice qui gère les notifications

const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationReducer,
  },
});

export default store;
