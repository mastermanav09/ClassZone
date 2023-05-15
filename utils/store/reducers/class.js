import { getError } from "@/helper/getError";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ERROR_TOAST, SUCCESS_TOAST } from "../../constants";
import axios from "axios";

export const createClass = createAsyncThunk(
  "class/createClass",
  async (data, { _, dispatch }) => {
    const { setIsLoading, router, classData } = data;

    setIsLoading(true);

    try {
      const res = await axios({
        method: "POST",
        url: `/api/class/create`,
        data: {
          ...classData,
        },
      });

      const newClass = res.data.class;
      const message = res.data.message;

      dispatch(classActions.addUserTeachingClasses(newClass));

      router.push(`/classes/${newClass._id}`);

      setTimeout(
        () => notifyAndUpdate(SUCCESS_TOAST, "success", message, toast),
        1000
      );
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
  }
);

export const joinClass = createAsyncThunk(
  "class/joinClass",
  async (data, { _, dispatch }) => {
    const { classId, setIsLoading, router } = data;

    setIsLoading(true);

    try {
      const res = await axios({
        method: "POST",
        url: `/api/class/join`,
        data: {
          classId,
        },
      });

      const joindedClass = res.data.class;
      const message = res.data.message;

      dispatch(classActions.addUserEnrolledClasses(joindedClass));
      router.push(`/classes/${joindedClass._id}`);

      setTimeout(
        () => notifyAndUpdate(SUCCESS_TOAST, "success", message, toast),
        1000
      );
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
  }
);

export const createNewAnnouncement = createAsyncThunk(
  "class/createAnnouncement",
  async (data, { _, dispatch }) => {
    const { classId, content, setIsLoading } = data;

    // setIsLoading(true);

    try {
      const res = await axios({
        method: "POST",
        url: `/api/class/createAnnouncement`,
        data: {
          classId,
          content,
        },
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    // setIsLoading(false);
  }
);

const classSlice = createSlice({
  name: "class",
  initialState: {
    userEnrolledClasses: null,
    userTeachingClasses: null,
  },

  reducers: {
    loadClasses(state, action) {
      state.userEnrolledClasses = action.payload.userEnrolledClasses;
      state.userTeachingClasses = action.payload.userTeachingClasses;
    },

    addUserTeachingClasses(state, action) {
      if (!state.userTeachingClasses) {
        state.userTeachingClasses = [];
      }

      state.userTeachingClasses.unshift(action.payload);
    },

    addUserEnrolledClasses(state, action) {
      if (!state.userEnrolledClasses) {
        state.userEnrolledClasses = [];
      }

      state.userEnrolledClasses.unshift(action.payload);
    },

    addNewAnnouncement(state, action) {
      const classIndex = state.userTeachingClasses.findIndex();
    },
  },
});

export default classSlice.reducer;
export const classActions = classSlice.actions;
