import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
  isLoggedIn:
    localStorage.getItem("isLoggedIn") !== "undefined"
      ? JSON.parse(localStorage.getItem("isLoggedIn"))
      : false,
  role:
    localStorage.getItem("role") !== "undefined"
      ? localStorage.getItem("role")
      : "",
  data:
    localStorage.getItem("data") !== "undefined"
      ? JSON.parse(localStorage.getItem("data"))
      : {},
};

// create account
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const res = axiosInstance.post("/user/register", data);
    toast.promise(res, {
      loading: "Wait! creating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create account",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// login funtion
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosInstance.post("/user/login", data);
    toast.promise(res, {
      loading: "Wait! authentication in progress...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to log in",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// logout function
export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosInstance.post("/user/logout");
    toast.promise(res, {
      loading: "Wait! logout in progress...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to logout",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// update profile
export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      const res = axiosInstance.put(`/user/update/${data[0]}`, data[1]);
      toast.promise(res, {
        loading: "Wait! updating your profile",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update profile.",
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
);

export const changePassword = createAsyncThunk(
  "/changePassword",
  async (data) => {
    try {
      const res = axiosInstance.post("/user/change-password", data);
      toast.promise(res, {
        loading: "Wait! updating your password",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to change password",
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "/forgotPassword",
  async (data) => {
    try {
      const res = axiosInstance.post("/user/reset", data);
      toast.promise(res, {
        loading: "Wait! sending forgot-password mail...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to send mail, try again",
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "/resetPassword",
  async (data) => {
    try {
      const res = axiosInstance.post(`/user/reset/${data[0]}`, data[1]);
      toast.promise(res, {
        loading: "Wait! sending updating password...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update password",
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
);

// get-user
export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = axiosInstance("/user/me");
    return (await res).data;
  } catch (error) {
    toast.error(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.fulfilled, (state, action) => {
        if (!action?.payload?.success) return;
        console.log(action);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        ((state.isLoggedIn = true), (state.role = action?.payload?.user?.role));
        state.data = action?.payload?.user;
      })
      .addCase(login.fulfilled, (state, action) => {
        if (!action?.payload?.success) return;
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        ((state.isLoggedIn = true), (state.role = action?.payload?.user?.role));
        state.data = action?.payload?.user;
      })
      .addCase(logout.fulfilled, (state, action) => {
        if (!action?.payload?.success) return;
        localStorage.clear();
        ((state.isLoggedIn = false), (state.role = ""));
        state.data = {};
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (!action?.payload?.user) return;
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        ((state.isLoggedIn = true), (state.role = action?.payload?.user?.role));
        state.data = action?.payload?.user;
      });
  },
});

export default authSlice.reducer;
