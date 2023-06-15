import { getError } from "@/helper/getError";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  ERROR_TOAST,
  SUCCESS_TOAST,
  SUCCESS_DELETE_TOAST,
  UNPIN_ANNOUNCEMENT_TOAST,
  PIN_ANNOUNCEMENT_TOAST,
  SUCCESS_CREATE_EDIT_TOAST,
} from "../../constants";
import axios from "axios";
import { getSession } from "next-auth/react";

export const createClass = createAsyncThunk(
  "class/createClass",
  async (data, { _, dispatch }) => {
    const { setIsLoading, router, classData, pathname } = data;

    setIsLoading(true);

    try {
      const res = await axios({
        method: "POST",
        url: `/api/class/create`,
        data: {
          ...classData,
          pathname,
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
      router.replace(`/classes/${newClass._id}`);

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
    const { classId, setIsLoading, router, pathname } = data;

    setIsLoading(true);

    try {
      const res = await axios({
        method: "POST",
        url: `/api/class/join`,
        data: {
          classId,
          pathname,
        },
      });

      const joindedClass = res.data.class;
      const message = res.data.message;

      dispatch(classActions.addUserEnrolledClasses(joindedClass));
      router.replace(`/classes/${joindedClass._id}`);

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
      announcementId,
      isPinned,
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
            isPinned,
          })
        );
      } else {
        dispatch(
          classSlice.actions.addNewAnnouncement({
            announcements: res.data.announcements,
          })
        );
      }

      let { message } = res.data;
      notifyAndUpdate(SUCCESS_CREATE_EDIT_TOAST, "success", message, toast);
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
  async (data, { _, dispatch }) => {
    const {
      _id: announcementId,
      classId,
      isPinned,
      setIsLoading,
      closeConfirmDeleteAnnouncementHandler,
    } = data;

    try {
      setIsLoading(true);
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
          isPinned,
        })
      );

      const { message } = res.data;

      notifyAndUpdate(SUCCESS_DELETE_TOAST, "success", message, toast);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
    closeConfirmDeleteAnnouncementHandler();
  }
);

export const manageAnnouncementPin = createAsyncThunk(
  "class/manageAnnouncementPin",
  async (data, { dispatch }) => {
    const { _id: announcementId, classId, isPinned } = data;

    try {
      dispatch(
        classSlice.actions.manageAnnouncementPin({
          announcementId,
          isPinned,
        })
      );

      const res = await axios({
        method: "PATCH",
        url: `/api/class/announcement/managePin`,
        data: {
          announcementId,
          classId,
          isPinned,
        },
      });

      let type = isPinned ? "unpin" : "pin";

      if (res.status !== 200) {
        const error = new Error(`Couldn't ${type} the announcement!`);
        error.statusCode = 400;
        throw error;
      }
    } catch (error) {
      dispatch(
        classSlice.actions.manageAnnouncementPin({
          announcementId,
          isPinned: !isPinned,
        })
      );

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
      const { announcementId, content, isPinned } = action.payload;
      const updatedAnnouncements = isPinned
        ? state.currentClassDetails.pinnedAnnouncements
        : state.currentClassDetails.announcements;

      const ind = updatedAnnouncements.findIndex(
        (item) => item._id === announcementId
      );

      updatedAnnouncements[ind].text = content;
      updatedAnnouncements[ind].isEdited = true;

      if (isPinned) {
        state.currentClassDetails.pinnedAnnouncements = updatedAnnouncements;
      } else {
        state.currentClassDetails.announcements = updatedAnnouncements;
      }
    },

    deleteAnnouncement(state, action) {
      const { announcementId, isPinned } = action.payload;
      const updatedAnnouncements = isPinned
        ? state.currentClassDetails.pinnedAnnouncements
        : state.currentClassDetails.announcements;

      const ind = updatedAnnouncements.findIndex(
        (item) => item._id === announcementId
      );

      updatedAnnouncements.splice(ind, 1);

      if (isPinned) {
        state.currentClassDetails.pinnedAnnouncements = updatedAnnouncements;
      } else {
        state.currentClassDetails.announcements = updatedAnnouncements;
      }
    },

    manageAnnouncementPin(state, action) {
      const { announcementId, isPinned } = action.payload;
      const updatedAnnouncements = isPinned
        ? state.currentClassDetails.pinnedAnnouncements
        : state.currentClassDetails.announcements;

      const ind = updatedAnnouncements.findIndex(
        (item) => item._id === announcementId
      );

      updatedAnnouncements[ind].isPinned = !isPinned;
      const announcement = updatedAnnouncements[ind];
      updatedAnnouncements.splice(ind, 1);

      if (isPinned) {
        let sortedAnnouncements = state.currentClassDetails.announcements;
        sortedAnnouncements.push(announcement);
        sortedAnnouncements.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        state.currentClassDetails.announcements = sortedAnnouncements;
        state.currentClassDetails.pinnedAnnouncements = updatedAnnouncements;
      } else {
        state.currentClassDetails.pinnedAnnouncements.unshift(announcement);
        state.currentClassDetails.announcements = updatedAnnouncements;
      }
    },
  },
});

export default classSlice.reducer;
export const classActions = classSlice.actions;
