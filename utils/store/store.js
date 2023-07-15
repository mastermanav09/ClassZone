import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import classReducer from "./reducers/class";

const store = configureStore({
  reducer: {
    user: userReducer,
    class: classReducer,
  },
});

export default store;
