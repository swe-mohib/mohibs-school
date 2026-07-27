import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
  lectures: [],
};

export const getCourseLectures = createAsyncThunk(
  "/getCourseLectures",
  async (id) => {
    try {
      const response = axiosInstance.get(`/courses/${id}`);
      toast.promise(response, {
        loading: "Wait! loading your lectures",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to get lectures.",
      });
      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
);

export const removeLecture = createAsyncThunk(
  "/removeLecture",
  async (data) => {
    try {
      const response = axiosInstance.delete(
        `/courses?courseId=${data.courseId}&lectureId=${data.lectureId}`,
      );

      toast.promise(response, {
        loading: "Wait removing the lecture",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to remove lecture",
      });
      return (await response)?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
);

export const addLecture = createAsyncThunk("/addLecture", async (data) => {
  try {
    const response = axiosInstance.post(`/courses/${data[0]}`, data[1]);
    toast.promise(response, {
      loading: "Wait adding lecture to course",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to add lecture to course",
    });
    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const lectureSlice = createSlice({
  name: "lectures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLectures.fulfilled, (state, action) => {
        if (!action?.payload?.lectures) return;
        state.lectures = action?.payload?.lectures;
      })
      .addCase(addLecture.fulfilled, (state, action) => {
        if (!action?.payload?.course) return;
        state.lectures = action?.payload?.course?.lectures;
      });
  },
});

export default lectureSlice.reducer;
