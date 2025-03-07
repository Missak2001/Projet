// src/redux/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  followersCount: 0,
  followingCount: 0,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    setProfileData: (state, action) => {
      state.userData = action.payload.userData;
      state.followersCount = action.payload.followersCount;
      state.followingCount = action.payload.followingCount;
      state.isLoading = false;
    },
    setProfileError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateProfileData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
  },
});

export const { startLoading, setProfileData, setProfileError, updateProfileData } = profileSlice.actions;

export default profileSlice.reducer;
