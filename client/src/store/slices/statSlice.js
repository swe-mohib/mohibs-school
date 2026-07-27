import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
  allUserCount: 0,
  subscribedCount: 0,
};

export const getStatsData = createAsyncThunk("/getStatsData", async () => {
  try {
    const res = axiosInstance.get("/admin/stats/users");
    toast.promise(res, {
      loading: "Wait stats are loading...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to load stats.",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      if (action?.payload?.success) {
        ((state.allUserCount = action?.payload?.allUsersCount),
          (state.subscribedCount = action?.payload?.subscribedUsersCount));
      }
    });
  },
});

export default statSlice.reducer;
