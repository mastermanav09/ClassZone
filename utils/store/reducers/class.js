import { getError } from "@/helper/getError";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  ERROR_TOAST,
  SUCCESS_TOAST,
  SUCCESS_DELETE_TOAST,
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

      if (requestedClass?.announcements) {
        dispatch(classActions.setCurrentClass(requestedClass));
        return;
      }

      const res = await axios({
        method: "GET",
        url: `/api/class/${classId}`,
      });

      dispatch(classSlice.actions.setCurrentClass(res.data.class));
    } catch (error) {
      console.log(error);
      let errorStatusCode = error.status || error.response?.data?.status;
      if (errorStatusCode === 422 || errorStatusCode === 404) {
        return router.replace("/not_found");
      } else {
        const message = getError(error);
        notifyAndUpdate(ERROR_TOAST, "error", message, toast);
      }
    }
  }
);

export const getClassPeople = createAsyncThunk(
  "class/getClassPeople",
  async (data, { dispatch }) => {
    const { classId, router } = data;

    try {
      const res = await axios({
        method: "GET",
        url: `/api/class/${classId}/people`,
      });

      dispatch(
        classSlice.actions.setClassPeople({
          classId: classId,
          people: res.data.people,
          teacher: res.data.teacher,
        })
      );
    } catch (error) {
      console.log(error);
      let errorStatusCode = error.status || error.response?.data?.status;
      if (errorStatusCode === 422 || errorStatusCode === 404) {
        return router.replace("/not_found");
      } else {
        const message = getError(error);
        notifyAndUpdate(ERROR_TOAST, "error", message, toast);
      }
    }

    setIsLoading(false);
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
      announcementId,
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
    const { announcementId, classId, isPinned } = data;

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

export const getClassAssignments = createAsyncThunk(
  "class/getClassAssignments",
  async (data, { dispatch }) => {
    const { classId, router } = data;

    try {
      const res = await axios({
        method: "GET",
        url: `/api/class/${classId}/assignments`,
      });

      dispatch(
        classSlice.actions.setClassAssignments({
          classId: classId,
          assignments: res.data.assignments,
          teacher: res.data.teacher,
        })
      );
    } catch (error) {
      console.log(error);
      let errorStatusCode = error.status || error.response?.data?.status;
      if (errorStatusCode === 422 || errorStatusCode === 404) {
        return router.replace("/not_found");
      } else {
        const message = getError(error);
        notifyAndUpdate(ERROR_TOAST, "error", message, toast);
      }
    }
  }
);

export const createAssignment = createAsyncThunk(
  "assignment/createAssignment",
  async (data, { dispatch }) => {
    const {
      title,
      description,
      classId,
      file,
      selectedDate,
      setIsLoading,
      setOpenAssignmentModal,
      reset,
      setFile,
    } = data;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("classId", classId);
      formData.append("dueDate", selectedDate);
      formData.append("file", file);

      const res = await axios({
        url: "/api/class/assignment/create",
        method: "POST",
        data: formData,

        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(classActions.addNewAssignment(res.data.assignment));
      setFile(null);
      setOpenAssignmentModal(false);
      reset();
      let { message } = res.data;
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
  }
);

export const createSubmission = createAsyncThunk(
  "assignment/createSubmission",
  async (data, { dispatch }) => {
    const {
      file,
      setFile,
      assignmentId,
      classId,
      setAssignmentLoader: setIsLoading,
      setIsNewFileSelected,
      setIsFileSubmitted,
      setOpenUploadFileModal,
      setUserComment,
      userCommentRef,
    } = data;

    try {
      const comment =
        userCommentRef?.current?.value.trim().length > 0
          ? userCommentRef.current.value
          : "";

      setIsLoading(true);
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("classId", classId);
      formData.append("comment", comment);
      formData.append("file", file);

      const res = await axios({
        url: "/api/class/assignment/upload",
        method: "POST",
        data: formData,

        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { message, ...submissionDetail } = res.data;
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast);

      dispatch(
        classActions.addAssignmentSubmission({
          classId,
          assignmentId,
          ...submissionDetail,
        })
      );

      setFile(null);
      setIsNewFileSelected(false);
      setIsFileSubmitted(true);
      setOpenUploadFileModal(false);
      userCommentRef.current.value = "";
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
  }
);

export const removeSubmission = createAsyncThunk(
  "assignment/removeSubmission",
  async (data, { dispatch }) => {
    const {
      setAssignmentLoader: setIsLoading,
      classId,
      assignmentId,
      setIsFileSubmitted,
      setOpenUploadFileModal,
    } = data;

    try {
      setIsLoading(true);

      const res = await axios({
        url: "/api/class/assignment/upload",
        method: "DELETE",
        params: {
          classId: classId,
          assignmentId: assignmentId,
        },
      });

      let { message } = res.data;
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast);

      dispatch(
        classActions.removeAssignmentSubmission({
          classId,
          assignmentId,
        })
      );

      setOpenUploadFileModal(false);
      setIsFileSubmitted(false);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
  }
);

export const deleteAssignment = createAsyncThunk(
  "assignment/deleteAssignment",
  async (data, { dispatch }) => {
    const {
      deleteAssignmentId,
      classId,
      setIsLoading,
      closeConfirmDeleteAssignmentHandler,
    } = data;

    try {
      setIsLoading(true);
      const res = await axios.delete(`/api/class/assignment/delete`, {
        params: {
          deleteAssignmentId,
          classId,
        },
      });

      dispatch(classActions.deleteAssignment(res.data._id));
      let { message } = res.data;
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast);
      closeConfirmDeleteAssignmentHandler();
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
  }
);

export const getAssignmentDetails = createAsyncThunk(
  "assignment/getAssignmentDetails",
  async (data, { dispatch }) => {
    const { assignmentId, classId, router, setClassAssignment } = data;

    try {
      const res = await axios.get(`/api/class/${classId}/${assignmentId}`);
      setClassAssignment(res.data.assignment);
    } catch (error) {
      console.log(error);
      let errorStatusCode = error.status || error.response?.data?.status;
      if (errorStatusCode === 401) {
        router.replace("/unauthorized");
      } else if (errorStatusCode === 404 || errorStatusCode === 422) {
        router.replace("/not_found");
      } else {
        const message = getError(error);
        notifyAndUpdate(ERROR_TOAST, "error", message, toast);
      }
    }
  }
);

export const getAssignmentSubmissions = createAsyncThunk(
  "assignment/getAssignmentSubmissions",
  async (data, { dispatch }) => {
    const { assignmentId, classId, router, setAssignmentSubmissions } = data;

    try {
      const res = await axios.get(
        `/api/class/${classId}/${assignmentId}/submissions`
      );
      setAssignmentSubmissions(res.data.submissions);
    } catch (error) {
      console.log(error);
      let errorStatusCode = error.status || error.response?.data?.status;
      if (errorStatusCode === 401) {
        router.replace("/unauthorized");
      } else if (errorStatusCode === 404 || errorStatusCode === 422) {
        router.replace("/not_found");
      } else {
        const message = getError(error);
        notifyAndUpdate(ERROR_TOAST, "error", message, toast);
      }
    }
  }
);

export const getAssignmentSubmissionsRemaining = createAsyncThunk(
  "assignment/getAssignmentSubmissionsRemaining",
  async (data, { dispatch }) => {
    const { assignmentId, classId, router, setAssignmentSubmissionsRemaining } =
      data;

    try {
      const res = await axios.get(
        `/api/class/${classId}/${assignmentId}/submissions/remaining`
      );
      setAssignmentSubmissionsRemaining(res.data.remainingSubmissions);
    } catch (error) {
      console.log(error);
      let errorStatusCode = error.status || error.response?.data?.status;
      if (errorStatusCode === 401) {
        router.replace("/unauthorized");
      } else if (errorStatusCode === 404 || errorStatusCode === 422) {
        router.replace("/not_found");
      } else {
        const message = getError(error);
        notifyAndUpdate(ERROR_TOAST, "error", message, toast);
      }
    }
  }
);

export const getStudentRemainingAssignmentsStatus = createAsyncThunk(
  "assignment/getStudentRemainingAssignmentsStatus",
  async (data, { getState, dispatch }) => {
    const {
      classId,
      setStudentRemainingAssignmentCount,
      setStudentRemainingAssignmentCountLoader,
    } = data;

    try {
      setStudentRemainingAssignmentCountLoader(true);
      const res = await axios({
        method: "GET",
        url: `/api/class/${classId}/remainingAssignmentCount`,
      });

      setStudentRemainingAssignmentCount(res.data.assignmentsRemaining);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setStudentRemainingAssignmentCountLoader(false);
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
    // class
    loadClasses(state, action) {
      state.userEnrolledClasses = action.payload.userEnrolledClasses;
      state.userTeachingClasses = action.payload.userTeachingClasses;
    },

    setCurrentClass(state, action) {
      state.currentClassDetails = {
        ...action.payload,
      };

      const ind = state.classesCache.findIndex(
        (item) => item._id === action.payload._id
      );

      if (ind === -1) {
        state.classesCache.push(action.payload);
      } else {
        state.classesCache[ind] = {
          ...state.classesCache[ind],
          ...action.payload,
        };
      }
    },

    addAssignmentSubmission(state, action) {
      const { classId, assignmentId, ...details } = action.payload;
      const classInd = state.classesCache.findIndex(
        (item) => item._id === classId
      );

      const assignmentInd = state.classesCache[classInd].assignments.findIndex(
        (assignment) => assignment._id === assignmentId
      );

      state.classesCache[classInd].assignments[assignmentInd] = {
        ...state.classesCache[classInd].assignments[assignmentInd],
        responses: [{ ...details }],
      };

      const assignmentInd2 = state.currentClassDetails.assignments.findIndex(
        (assignment) => assignment._id === assignmentId
      );

      state.currentClassDetails.assignments[assignmentInd2] = {
        ...state.currentClassDetails.assignments[assignmentInd2],
        responses: [{ ...details }],
      };
    },

    removeAssignmentSubmission(state, action) {
      const { classId, assignmentId } = action.payload;
      const classInd = state.classesCache.findIndex(
        (item) => item._id === classId
      );

      const assignmentInd = state.classesCache[classInd].assignments.findIndex(
        (assignment) => assignment._id === assignmentId
      );

      state.classesCache[classInd].assignments[assignmentInd] = {
        ...state.classesCache[classInd].assignments[assignmentInd],
        responses: [],
      };

      const assignmentInd2 = state.currentClassDetails.assignments.findIndex(
        (assignment) => assignment._id === assignmentId
      );

      state.currentClassDetails.assignments[assignmentInd2] = {
        ...state.currentClassDetails.assignments[assignmentInd2],
        responses: [],
      };
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

    // people
    setClassPeople(state, action) {
      const { classId, ...details } = action.payload;

      state.currentClassDetails = {
        _id: classId,
        ...state.currentClassDetails,
        ...details,
      };

      const ind = state.classesCache.findIndex((item) => item._id === classId);

      if (ind == -1) {
        state.classesCache.push({
          _id: classId,
          ...details,
        });
      } else {
        state.classesCache[ind] = {
          ...state.classesCache[ind],
          ...details,
        };
      }
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

    // assignment
    addNewAssignment(state, action) {
      if (!state.currentClassDetails.assignments) {
        state.currentClassDetails.assignments = [];
      }

      state.currentClassDetails.assignments.unshift(action.payload);
    },

    deleteAssignment(state, action) {
      const assignmentId = action.payload;
      const updatedAssignments = state.currentClassDetails.assignments;

      const ind = updatedAssignments.findIndex(
        (item) => item._id === assignmentId
      );

      updatedAssignments.splice(ind, 1);
      state.currentClassDetails.assignments = updatedAssignments;
    },

    setClassAssignments(state, action) {
      const { classId, ...details } = action.payload;

      state.currentClassDetails = {
        _id: classId,
        ...state.currentClassDetails,
        ...details,
      };

      const ind = state.classesCache.findIndex((item) => item._id === classId);

      if (ind == -1) {
        state.classesCache.push({
          _id: classId,
          ...details,
        });
      } else {
        state.classesCache[ind] = {
          ...state.classesCache[ind],
          ...details,
        };
      }
    },
  },
});

export default classSlice.reducer;
export const classActions = classSlice.actions;
