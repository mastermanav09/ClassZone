import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import classReducer from "./reducers/class";
import uiReducer from "./reducers/ui";

const store = configureStore({
  reducer: {
    user: userReducer,
    class: classReducer,
    ui: uiReducer,
  },
});

export default store;
