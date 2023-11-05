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
import { classActions } from "./class";

export const signup = createAsyncThunk(
  "user/signup",
  async (data, { getState, dispatch }) => {
    const {
      name,
      email,
      password,
      setIsLoading,
      redirect,
      router,
      joinClass,
      classId,
    } = data;

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

      dispatch(
        login({
          email,
          password,
          router,
          setIsLoading,
          redirect,
          joinClass,
          classId,
        })
      );
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
    }

    setIsLoading(false);
  }
);

export const login = createAsyncThunk("user/login", async (data) => {
  const {
    email,
    password,
    setIsLoading,
    redirect,
    joinClass,
    classId,
    router,
  } = data;

  let redirectLink = "/";
  if (redirect && joinClass === "true" && classId) {
    redirectLink = `/?jc=true&id=${classId}`;
  }

  try {
    setIsLoading(true);
    const res = await signIn("credentials", {
      callbackUrl: "/",
      redirect: true,
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

    router.replace(redirectLink);
  } catch (error) {
    const message = getError(error);
    if (error.statusCode === 500) {
      return notifyAndUpdate(SERVER_ERROR_TOAST, "error", message, toast, null);
    }

    notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
  }

  setIsLoading(false);
});

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (data, { _, dispatch }) => {
    try {
      const res = await axios({
        method: "GET",
        url: `/api/user/loaduser`,
      });

      const { enrolled: userEnrolledClasses, teaching: userTeachingClasses } =
        res.data.user;

      dispatch(
        classActions.loadClasses({
          userEnrolledClasses,
          userTeachingClasses,
        })
      );
    } catch (error) {
      console.log(error);
      const message = getError(error);
      notifyAndUpdate(ERROR_TOAST, "error", message, toast, null);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {},
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
