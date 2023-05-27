import { getError } from "@/helper/getError";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ERROR_TOAST, SUCCESS_TOAST } from "../../constants";
import axios from "axios";
import { getSession } from "next-auth/react";

export const createClass = createAsyncThunk(
  "class/createClass",
  async (data, { _, dispatch }) => {
    const { setIsLoading, router, classData, toggleAddClassModal } = data;

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

      const session = await getSession();
      const { user } = session;

      newClass.teacher = {
        credentials: {
          email: user.email,
          name: user.name,
          userImage: user.image,
        },
      };

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
    toggleAddClassModal();
  }
);

export const joinClass = createAsyncThunk(
  "class/joinClass",
  async (data, { _, dispatch }) => {
    const { classId, setIsLoading, router, toggleJoinClassModal } = data;

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
    toggleJoinClassModal();
  }
);

export const getClass = createAsyncThunk(
  "class/getClass",
  async (data, { getState, dispatch }) => {
    const { classId, router } = data;

    try {
      const state = getState();
      const { class: classState } = state;

      const requestedClass = classState.classesCache.find(
        (item) => item._id === classId
      );

      if (requestedClass) {
        return dispatch(classActions.setCurrentClass(requestedClass));
      }

      const res = await axios({
        method: "GET",
        url: `/api/class/${classId}`,
      });

      dispatch(classSlice.actions.setCurrentClass(res.data.class));
      dispatch(classSlice.actions.cacheTheClass(res.data.class));
    } catch (error) {
      console.log(error);

      if (error.status === 404 || error.response?.data?.status === 404) {
        return router.replace("/not_found");
      }

      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }
  }
);

export const manageAnnouncement = createAsyncThunk(
  "class/manageAnnouncement",
  async (data, { _, dispatch }) => {
    const {
      classId,
      content,
      setIsLoading,
      setTextEditor,
      isEditAnnouncement: announcementId,
    } = data;

    setIsLoading(true);
    let method = announcementId ? "PATCH" : "POST";

    try {
      const res = await axios({
        method: method,
        url: `/api/class/announcement/manage`,
        data: {
          classId,
          content,
          ...(announcementId && { announcementId }),
        },
      });

      if (res.status !== 201 && res.status !== 200) {
        const error = new Error("Couldn't update the announcement!");
        error.statusCode = 400;
        throw error;
      }

      if (announcementId) {
        dispatch(
          classSlice.actions.editAnnouncement({
            announcementId,
            content,
          })
        );
      } else {
        dispatch(
          classSlice.actions.addNewAnnouncement({
            announcements: res.data.announcements,
          })
        );
      }
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
    setTextEditor(false);
  }
);

export const deleteAnnouncement = createAsyncThunk(
  "class/deleteAnnouncement",
  async (data, { getState, dispatch }) => {
    const { _id: announcementId, classId } = data;

    try {
      const res = await axios.delete(`/api/class/announcement/delete`, {
        params: {
          announcementId,
          classId,
        },
      });

      if (res.status !== 200) {
        const error = new Error("Couldn't delete the announcement!");
        error.statusCode = 400;
        throw error;
      }

      dispatch(
        classSlice.actions.deleteAnnouncement({
          announcementId,
        })
      );

      const { message } = res.data;
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }
  }
);

const classSlice = createSlice({
  name: "class",
  initialState: {
    userEnrolledClasses: null,
    userTeachingClasses: null,
    classesCache: [],
    currentClassDetails: {},
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

    setCurrentClass(state, action) {
      state.currentClassDetails = action.payload;
    },

    cacheTheClass(state, action) {
      state.classesCache.push(action.payload);
    },

    // announcement
    addNewAnnouncement(state, action) {
      state.currentClassDetails.announcements = action.payload.announcements;
    },

    editAnnouncement(state, action) {
      const { announcementId, content } = action.payload;
      const updatedAnnouncements = state.currentClassDetails.announcements;

      const ind = updatedAnnouncements.findIndex(
        (item) => item._id === announcementId
      );

      updatedAnnouncements[ind].text = content;
      updatedAnnouncements[ind].isEdited = true;
      state.currentClassDetails.announcements = updatedAnnouncements;
    },

    deleteAnnouncement(state, action) {
      const { announcementId } = action.payload;
      const updatedAnnouncements = state.currentClassDetails.announcements;

      const ind = updatedAnnouncements.findIndex(
        (item) => item._id === announcementId
      );

      updatedAnnouncements.splice(ind, 1);
      state.currentClassDetails.announcements = updatedAnnouncements;
    },
  },
});

export default classSlice.reducer;
export const classActions = classSlice.actions;
