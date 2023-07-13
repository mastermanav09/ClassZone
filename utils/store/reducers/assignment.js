import { getError } from "@/helper/getError";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ERROR_TOAST, SUCCESS_TOAST } from "../../constants";
import { toast } from "react-toastify";

export const createAssignment = createAsyncThunk(
  "assignment/createAssignment",
  async (data, { dispatch }) => {
    const {
      title,
      description,
      classId,
      file,
      startDate: dueDate,
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
      formData.append("dueDate", dueDate);
      formData.append("file", file);

      const res = await axios({
        url: "/api/class/assignment/create",
        method: "POST",
        data: formData,

        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setOpenAssignmentModal(false);
      reset();
      setFile(null);
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

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: {},
});

export default assignmentSlice.reducer;
export const assignmentActions = assignmentSlice.actions;
