import Course from "../models/course.model.js";
import { AppError } from "../utils/error.util.js";
import {
  deleteFolderWithContentsOnCloudinary,
  destroyImageOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.util.js";
import fs from "fs/promises";

const removeTemporaryUpload = async (file) => {
  if (file?.path) {
    await fs.rm(file.path, { force: true });
  }
};

/**
 * @CREATE_COURSE
 * @ROUTE @POST {{URL}}/api/v1/courses/
 * @ACCESS PRIVATE(ADMIN ONLY)
 */
export const createCourse = async (req, res, next) => {
  const thumbnail = req.file;
  try {
    // If thumbnail is not there then return with error
    if (!thumbnail) {
      throw new Error("Thumbnail is required");
    }

    //  Destructuring neccessary data
    const { title, description, category, createdBy } = req.body;

    // If issue return an error
    if (!title || !description || !category || !createdBy) {
      throw new Error("Fill all the fields!");
    }

    // Check if course exists with the provided title
    const courseExists = await Course.findOne({ title });
    if (courseExists) {
      throw new Error(
        "Course is already exist with this title, use unique one"
      );
    }

    // Transformation option for cloudinary
    const option = {
      folder: `lms/courses/${title}`,
      width: 250,
      height: 250,
      crop: "fill",
    };

    // upload thumbnail on clodinary
    const result = await uploadOnCloudinary(thumbnail.path, option);
    if (!result) {
      throw new Error("Internal Server Error");
    }

    // First create course then add thumbnail
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        folder: result.folder,
      },
    });

    if (!course) {
      await destroyImageOnCloudinary(result.public_id);
      throw new Error("Internal Server Error");
    }

    // Saving in DB
    await course.save();

    await removeTemporaryUpload(thumbnail);

    res.status(200).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    await removeTemporaryUpload(thumbnail);
    return next(new AppError(500, error.message));
  }
};

/**
 * @GET_ALL_COURSES
 * @ROUTE @GET {{URL}}/api/v1/courses/
 * @ACCESS Public
 */
export const getAllCourses = async (_req, res, next) => {
  try {
    // Get course from the DB through courseId but without lectures details
    const courses = await Course.find({}).select("-lectures");
    if (!courses) {
      return next(new AppError("Something went wrong, Course not found!"));
    }
    res.status(200).json({
      success: true,
      message: "All Courses fetched",
      courses,
    });
  } catch (error) {
    return next(new AppError(400, error.message));
  }
};

/**
 * @ADD_LECTURES_TO_COURSE
 * @ROUTE @POST {{URL}}/api/v1/courses/:id
 * @ACCESS PRIVATE(ADMIN ONLY)
 */
export const addLectureToCourseById = async (req, res, next) => {
  // Check if lecture video is there is not, if not return with an error
  const lecture = req.file;
  try {
    if (!lecture) {
      throw new Error("Provide lecture video");
    }
    // Destructring the neccessary data
    const { title, description } = req.body;
    const { id } = req.params;

    if (!title || !description) {
      throw new Error("Title and description are required");
    }

    // Checking course detail in DB
    const course = await Course.findById(id);
    if (!course) {
      throw new Error("Something went wrong, Course not found!");
    }

    const option = {
      folder: course.thumbnail.folder,
      resource_type: "video",
    };
    // Upload file on cloudinary
    const result = await uploadOnCloudinary(lecture.path, option);
    if (!result) {
      throw new Error("Server Error!");
    }

    // Saving lecture detail in DB
    const lectureData = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
    course.lectures.push({
      title,
      description,
      lecture: lectureData,
    });

    course.numberOfLectures = course.lectures.length;

    await course.save();
    await removeTemporaryUpload(lecture);

    res.status(200).json({
      success: true,
      message: "Course fetched",
      course,
    });
  } catch (error) {
    await removeTemporaryUpload(lecture);
    return next(new AppError(400, error.message));
  }
};

/**
 * @GET_LECTURES_BY_COURSEID
 * @ROUTE @GET {{URL}}/api/v1/courses/:id
 * @ACCESS PROTECTED (ADMIN OR SUBSRIBERS ONLY)
 */
export const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError(400, "Something went wrong, Course not found"));
    }
    const lectures = course.lectures;
    res.status(200).json({
      success: true,
      message: "Lecture fetched",
      lectures,
    });
  } catch (error) {
    return next(new AppError(400, error.message));
  }
};

/**
 * @UPDATE_COURSE
 * @ROUTE @PUT {{URL}}/api/v1/courses/:id
 * @ACCESS PRIVATE (ADMIN ONLY)
 */
export const updateCourseById = async (req, res, next) => {
  const thumbnail = req.file;
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw new Error("Course Doesn't exist !");
    }

    const allowedFields = ["title", "description", "category", "createdBy"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        course[field] = req.body[field];
      }
    }

    // Updating thumbnail of the course, if thumbnail is there
    if (thumbnail) {
      // Transformation option for cloudinary
      const option = {
        folder: course.thumbnail.folder,
        width: 250,
        height: 250,
        crop: "fill",
      };

      // upload thumbnail on cloudinary
      const result = await uploadOnCloudinary(thumbnail.path, option);
      if (!result) {
        throw new Error("Server Error!, thumbnail could'nt be updated");
      }
      // Deleting old thumbnail from cloudinary
      await destroyImageOnCloudinary(course.thumbnail.public_id);

      // Saving new thumbnail details
      course.thumbnail.public_id = result.public_id;
      course.thumbnail.secure_url = result.secure_url;

      // Deleting the local file
      await removeTemporaryUpload(thumbnail);
    }

    // Saving details in DB
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    if (thumbnail) {
      await removeTemporaryUpload(thumbnail);
    }
    return next(new AppError(400, error.message));
  }
};

/**
 * @DELETE_COURSE
 * @ROUTE @DELETE {{URL}}/api/v1/courses/:id
 * @ACCESS PRIVATE (ADMIN ONLY)
 */
export const deleteCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Checking if course exist, if noe thorw error
    const course = await Course.findById(id);
    if (!course) {
      return next(
        new AppError(400, "Something went wrong!, Course not found.")
      );
    }

    // Deleting the course files,folder on cloudinary, if not, throw error
    await deleteFolderWithContentsOnCloudinary(course.thumbnail.folder);

    // Deleting course on the folder
    await Course.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return next(new AppError(400, error.message));
  }
};

/**
 * @REMOVE_LECTURE_FROM_COURSE
 * @ROUTE @DELETE {{URL}}/api/v1/courses?courseId=........&lectureId=.........
 * @ACCESS PRIVATE (ADMIN ONLY)
 */
export const removeLectureFromCourse = async (req, res, next) => {
  try {
    // Destructuring details from req.query
    const { courseId, lectureId } = req.query;

    if (!courseId || !lectureId) {
      return next(new AppError(400, "Internal server error"));
    }

    // Checking if course exist or not
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError(400, "Course not found"));
    }

    // Find the index of the lecture using the lectureId
    const lectureIndex = course.lectures.findIndex(
      (lecture) => lecture._id.toString() === lectureId.toString()
    );

    // If `lectureIndex = -1` then send error
    if (lectureIndex === -1) {
      return next(new AppError(400, "Lecture doesn't exist"));
    }

    // Delete the  lecture from the cloudinary first
    await destroyImageOnCloudinary(
      course.lectures[lectureIndex].lecture.public_id,
      {
        resource_type: "video",
      }
    );

    // Remove the lecture from array of lectures in DB
    course.lectures.splice(lectureIndex, 1);

    // Update the number of lectures
    course.numberOfLectures = course.lectures.length;

    // Saving the course object
    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture removed successfully",
      course,
    });
  } catch (error) {
    return next(new AppError(400, error.message));
  }
};
