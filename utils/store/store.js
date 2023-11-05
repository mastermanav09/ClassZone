import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import classReducer from "./reducers/class";

const store = configureStore({
  reducer: {
    user: userReducer,
    class: classReducer,
  },

  ...(process.env.NODE_ENV === "production" && { devTools: false }),
});

export default store;
