import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      state.push(action.payload);
    },
    markAsRead: (state, action) => {
      // Met à jour la notification et la marque comme lue
      const notification = state.find((notification) => notification.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
    removeNotification: (state, action) => {
      // Supprime la notification du state
      return state.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { addNotification, markAsRead, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
