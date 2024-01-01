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

      // const session = await getSession();
      // const { user } = session;

      // newClass.classDetails.teacher = {
      //   credentials: {
      //     email: user.email,
      //     name: user.name,
      //     userImage: user.image,
      //   },
      // };

      dispatch(classActions.addUserTeachingClasses(newClass));
      router.replace(`/classes/${newClass.classDetails._id}`);

      setTimeout(
        () => notifyAndUpdate(SUCCESS_TOAST, "success", message, toast, null),
        1000
      );
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
      router.replace(`/classes/${joindedClass.classDetails._id}`);

      setTimeout(
        () => notifyAndUpdate(SUCCESS_TOAST, "success", message, toast, null),
        1000
      );
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
        notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
      }
    }
  }
);

export const dragAndDropClasses = createAsyncThunk(
  "class/dragAndDrop",
  async (data, { dispatch }) => {
    try {
      const { fromIndex, toIndex, type, classId } = data;

      if (type !== "CLASS_CARD_ENROLLED" && type !== "CLASS_CARD_TEACHING") {
        return notifyAndUpdate(
          ERROR_TOAST,
          "error",
          "Invalid class type",
          toast,
          null
        );
      }

      if (type === "CLASS_CARD_ENROLLED") {
        dispatch(
          classActions.dragAndDropEnrolledClasses({ fromIndex, toIndex })
        );
      } else {
        dispatch(
          classActions.dragAndDropTeachingClasses({ fromIndex, toIndex })
        );
      }

      await axios({
        method: "PATCH",
        url: `/api/class/dragAndDrop`,
        data: {
          fromIndex,
          toIndex,
          type,
          classId,
        },
      });
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
        notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
      }
    }

    setIsLoading(false);
  }
);

export const removeClassMember = createAsyncThunk(
  "class/removeClassMember",
  async (data, { dispatch }) => {
    const {
      classId,
      removeMemberId: classMemberId,
      setIsLoading,
      confirmRemoveHandler,
    } = data;

    try {
      setIsLoading(true);
      const res = await axios({
        url: `/api/class/${classId}/people/remove`,
        method: "DELETE",
        params: { classMemberId, classId },
      });

      dispatch(
        classSlice.actions.removeClassMember({ classMemberId, classId })
      );
      confirmRemoveHandler(false, null);

      let { message } = res.data;
      notifyAndUpdate(SUCCESS_DELETE_TOAST, "success", message, toast, null);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
            classId,
          })
        );
      } else {
        dispatch(
          classSlice.actions.addNewAnnouncement({
            announcements: res.data.announcements,
            classId,
          })
        );
      }

      let { message } = res.data;
      notifyAndUpdate(
        SUCCESS_CREATE_EDIT_TOAST,
        "success",
        message,
        toast,
        null
      );
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
          classId,
        })
      );

      const { message } = res.data;

      notifyAndUpdate(SUCCESS_DELETE_TOAST, "success", message, toast, null);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
          classId,
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
          classId,
        })
      );

      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
        notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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

      dispatch(
        classActions.addNewAssignment({
          assignment: res.data.assignment,
          classId,
        })
      );
      setFile(null);
      setOpenAssignmentModal(false);
      reset();
      let { message } = res.data;
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast, null);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, 5000);
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
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast, null);

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
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast, null);

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
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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

      dispatch(
        classActions.deleteAssignment({ assignmentId: res.data._id, classId })
      );
      let { message } = res.data;
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast, null);
      closeConfirmDeleteAssignmentHandler();
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
        notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
        notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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
        notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
      }
    }
  }
);

export const getStudentRemainingAssignmentsStatus = createAsyncThunk(
  "assignment/getStudentRemainingAssignmentsStatus",
  async (data) => {
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
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
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

    addUserTeachingClasses(state, action) {
      if (!state.userTeachingClasses) {
        state.userTeachingClasses = [];
      }

      for (let i = 0; i < state.userTeachingClasses.length; i++) {
        state.userTeachingClasses[i].index =
          state.userTeachingClasses[i].index + 1;
      }

      state.userTeachingClasses.unshift(action.payload);
    },

    addUserEnrolledClasses(state, action) {
      if (!state.userEnrolledClasses) {
        state.userEnrolledClasses = [];
      }

      for (let i = 0; i < state.userEnrolledClasses.length; i++) {
        state.userEnrolledClasses[i].index =
          state.userEnrolledClasses[i].index + 1;
      }

      state.userEnrolledClasses.unshift(action.payload);
    },

    dragAndDropEnrolledClasses(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const updatedClasses = [...state.userEnrolledClasses];
      const [movedCard] = updatedClasses.splice(fromIndex, 1);
      updatedClasses.splice(toIndex, 0, movedCard);
      state.userEnrolledClasses = updatedClasses;
    },

    dragAndDropTeachingClasses(state, action) {
      const { fromIndex, toIndex } = action.payload;
      const updatedClasses = [...state.userTeachingClasses];
      const [movedCard] = updatedClasses.splice(fromIndex, 1);
      updatedClasses.splice(toIndex, 0, movedCard);
      state.userTeachingClasses = updatedClasses;
    },

    setDropCursor(state, action) {
      state.dnd = action.payload.valye;
    },

    addAssignmentSubmission(state, action) {
      const { classId, assignmentId, ...details } = action.payload;
      const classInd = state.classesCache.findIndex(
        (item) => item._id === classId
      );

      const assignmentInd = state.currentClassDetails.assignments.findIndex(
        (assignment) => assignment._id === assignmentId
      );

      state.currentClassDetails.assignments[assignmentInd] = {
        ...state.currentClassDetails.assignments[assignmentInd],
        responses: [{ ...details }],
      };

      const assignmentInd2 = state.classesCache[classInd].assignments.findIndex(
        (assignment) => assignment._id === assignmentId
      );

      state.classesCache[classInd].assignments[assignmentInd2] = {
        ...state.classesCache[classInd].assignments[assignmentInd2],
        responses: [{ ...details }],
      };
    },

    removeAssignmentSubmission(state, action) {
      const { classId, assignmentId } = action.payload;
      const classInd = state.classesCache.findIndex(
        (item) => item._id === classId
      );

      const assignmentInd = state.currentClassDetails.assignments.findIndex(
        (assignment) => assignment._id === assignmentId
      );

      state.currentClassDetails.assignments[assignmentInd] = {
        ...state.currentClassDetails.assignments[assignmentInd],
        responses: [],
      };

      const assignmentInd2 = state.classesCache[classInd].assignments.findIndex(
        (assignment) => assignment._id === assignmentId
      );

      state.classesCache[classInd].assignments[assignmentInd2] = {
        ...state.classesCache[classInd].assignments[assignmentInd2],
        responses: [],
      };
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

    removeClassMember(state, action) {
      const { classId, classMemberId } = action.payload;

      let updatedPeopleList = state.currentClassDetails.people.filter(
        (member) => member._id !== classMemberId
      );

      state.currentClassDetails = {
        ...state.currentClassDetails,
        people: updatedPeopleList,
      };

      const ind = state.classesCache.findIndex((item) => item._id === classId);

      updatedPeopleList = state.classesCache[ind].people.filter(
        (member) => member._id !== classMemberId
      );

      state.classesCache[ind] = {
        ...state.classesCache[ind],
        people: updatedPeopleList,
      };
    },

    // announcement
    addNewAnnouncement(state, action) {
      const { classId, announcements } = action.payload;

      state.currentClassDetails.announcements = announcements;
      const ind = state.classesCache.findIndex((item) => item._id === classId);
      state.classesCache[ind].announcements = announcements;
    },

    editAnnouncement(state, action) {
      const { announcementId, content, isPinned, classId } = action.payload;
      const updatedAnnouncements = isPinned
        ? state.currentClassDetails.pinnedAnnouncements
        : state.currentClassDetails.announcements;

      const ind = updatedAnnouncements.findIndex(
        (item) => item._id === announcementId
      );

      updatedAnnouncements[ind].text = content;
      updatedAnnouncements[ind].isEdited = true;

      const ind2 = state.classesCache.findIndex((item) => item._id === classId);

      if (isPinned) {
        state.currentClassDetails.pinnedAnnouncements = updatedAnnouncements;
        state.classesCache[ind2].pinnedAnnouncements = updatedAnnouncements;
      } else {
        state.currentClassDetails.announcements = updatedAnnouncements;
        state.classesCache[ind2].announcements = updatedAnnouncements;
      }
    },

    deleteAnnouncement(state, action) {
      const { announcementId, isPinned, classId } = action.payload;
      const updatedAnnouncements = isPinned
        ? state.currentClassDetails.pinnedAnnouncements
        : state.currentClassDetails.announcements;

      const ind = updatedAnnouncements.findIndex(
        (item) => item._id === announcementId
      );

      updatedAnnouncements.splice(ind, 1);

      const ind2 = state.classesCache.findIndex((item) => item._id === classId);

      if (isPinned) {
        state.currentClassDetails.pinnedAnnouncements = updatedAnnouncements;
        state.classesCache[ind2].pinnedAnnouncements = updatedAnnouncements;
      } else {
        state.currentClassDetails.announcements = updatedAnnouncements;
        state.classesCache[ind2].announcements = updatedAnnouncements;
      }
    },

    manageAnnouncementPin(state, action) {
      const { announcementId, isPinned, classId } = action.payload;
      const updatedAnnouncements = isPinned
        ? state.currentClassDetails.pinnedAnnouncements
        : state.currentClassDetails.announcements;

      const ind = updatedAnnouncements.findIndex(
        (item) => item._id === announcementId
      );

      updatedAnnouncements[ind].isPinned = !isPinned;
      const announcement = updatedAnnouncements[ind];
      updatedAnnouncements.splice(ind, 1);

      const ind2 = state.classesCache.findIndex((item) => item._id === classId);

      if (isPinned) {
        let sortedAnnouncements = state.currentClassDetails.announcements;
        sortedAnnouncements.push(announcement);
        sortedAnnouncements.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        state.currentClassDetails.announcements = sortedAnnouncements;
        state.currentClassDetails.pinnedAnnouncements = updatedAnnouncements;

        state.classesCache[ind2].announcements = sortedAnnouncements;
        state.classesCache[ind2].pinnedAnnouncements = updatedAnnouncements;
      } else {
        state.currentClassDetails.announcements = updatedAnnouncements;
        state.currentClassDetails.pinnedAnnouncements.unshift(announcement);

        state.classesCache[ind2].announcements = updatedAnnouncements;
        state.classesCache[ind2].pinnedAnnouncements.unshift(announcement);
      }
    },

    // assignment
    addNewAssignment(state, action) {
      const { classId, assignment } = action.payload;

      if (!state.currentClassDetails.assignments) {
        state.currentClassDetails.assignments = [];
      }

      state.currentClassDetails.assignments.unshift(assignment);

      const ind = state.classesCache.findIndex((item) => item._id === classId);

      if (!state.classesCache[ind].assignments)
        state.classesCache[ind].assignments = [];

      state.classesCache[ind].assignments.unshift(assignment);
    },

    deleteAssignment(state, action) {
      const { assignmentId, classId } = action.payload;
      const updatedAssignments = state.currentClassDetails.assignments;

      const ind = updatedAssignments.findIndex(
        (item) => item._id === assignmentId
      );

      updatedAssignments.splice(ind, 1);
      state.currentClassDetails.assignments = updatedAssignments;

      const ind2 = state.classesCache.findIndex((item) => item._id === classId);
      state.classesCache[ind2].assignments = updatedAssignments;
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
