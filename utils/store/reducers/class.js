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

    // setIsLoading(true);

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
      notifyAndUpdate(SUCCESS_TOAST, "success", message, toast);
      // router.push(`/classes/${newClass._id}`);
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
  initialState: {},

  reducers: {},
});

export default classSlice.reducer;
export const userActions = classSlice.actions;
