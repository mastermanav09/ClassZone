import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    navbarClassDropDown: false,
  },

  reducers: {
    toggleNavbarClassDropdown(state, action) {
      if (action.payload) {
        state.navbarClassDropDown = action.payload.status;
      } else {
        state.navbarClassDropDown = !state.navbarClassDropDown;
      }
    },
  },
});

export default uiSlice.reducer;
export const uiActions = uiSlice.actions;
