import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    loggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.loggedIn = true;
    },
    logout: (state) => {
      state.token = null;
      state.loggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
