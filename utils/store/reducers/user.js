import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";
import axios from "axios";
import { notifyAndUpdate } from "../../../src/helper/toastNotifyAndUpdate";
import {
  serverErrorResponse,
  unauthorizedErrorResponse,
} from "../../responses/errorResponse";
import { toast } from "react-toastify";
import { ERROR_TOAST, SERVER_ERROR_TOAST } from "../../constants";
import { getError } from "@/helper/getError";

export const signup = createAsyncThunk("user/signup", async (data) => {
  const { name, email, password, router, setIsLoading } = data;

  setIsLoading(true);

  try {
    const res = await axios({
      url: "/api/auth/signup",
      method: "POST",
      data: {
        name,
        email,
        password,
      },
    });

    if (res.status !== 201) {
      const error = new Error(res.data.message);
      error.statusCode = res.data.status;
      throw error;
    }

    await login({ email, password, setIsLoading, router });
  } catch (error) {
    console.log(error);
    const message = getError(error);
    notifyAndUpdate(ERROR_TOAST, "error", message, toast);
  }

  setIsLoading(false);
});

export const login = createAsyncThunk("user/login", async (data) => {
  const { email, password, router, setIsLoading } = data;

  setIsLoading(true);

  try {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res.ok || res.error) {
      const error = new Error();
      error.statusCode = res.status;

      if (res.status === 401) {
        error.message = unauthorizedErrorResponse(res.error).message;
      }

      if (res.status === 500) {
        error.message = serverErrorResponse().message;
      }

      throw error;
    }

    router.replace("/");
  } catch (error) {
    const message = getError(error);
    if (error.statusCode === 500) {
      return notifyAndUpdate(SERVER_ERROR_TOAST, "error", message, toast);
    }

    notifyAndUpdate(ERROR_TOAST, "error", message, toast);
  }

  setIsLoading(false);
});

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (data, { getState, dispatch }) => {
    const { setIsLoading } = data;

    setIsLoading(true);

    try {
      const res = await axios({
        method: "GET",
        url: `/api/user/loaduser`,
      });

      const user = res.data.user;
      dispatch(userSlice.actions.setUser(user));
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast);
    }

    setIsLoading(false);
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",

    credentials: {
      name: "",
      email: "",
      userImage: "",
      isAdmin: null,
    },

    enrolled: [],
    teaching: [],
  },

  reducers: {
    setUser(state, action) {
      state.id = action.payload._id;
      state.credentials = action.payload.credentials;
      state.enrolled = action.payload.enrolled;
      state.teaching = action.payload.teaching;
    },
  },
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
