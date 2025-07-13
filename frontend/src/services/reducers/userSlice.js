import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "services/api/authApi";
import { userApiSlice } from "services/api/userApi";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          console.log("payload", payload.data);
          state.user = payload.data.user;
        }
      )

      .addMatcher(
        userApiSlice.endpoints.updateUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data.user;
        }
      )
      .addMatcher(
        userApiSlice.endpoints.imageActions.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data.user;
        }
      )

      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
        return initialState;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const currentUser = (state) => state.root.user.user;
