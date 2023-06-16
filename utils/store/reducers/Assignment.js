import { getError } from "@/helper/getError";
import { notifyAndUpdate } from "@/helper/toastNotifyAndUpdate";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ERROR_TOAST } from "../../constants";
import { toast } from "react-toastify";

export const createAssignment = createAsyncThunk(
  "assignment/createAssignment",
  async (data, { dispatch }) => {
    const { setIsLoading, assignmentBody } = data;

    try {
      const res = await axios({
        method: "POST",
        data: assignmentBody,
      });

      console.log(res);
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }
  }
);

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: {},
});

export default assignmentSlice.reducer;
export const assignmentActions = assignmentSlice.actions;
