import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import classReducer from "./reducers/class";
import assignmentReducer from "./reducers/Assignment";

const store = configureStore({
  reducer: {
    user: userReducer,
    class: classReducer,
    assignment: assignmentReducer,
  },
});

export default store;
