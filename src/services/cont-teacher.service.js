import { BaseUrl } from "@/config/var.config";
import axios from "axios";

export const getUnapprovedTeachers = async (token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/teacher/unapproved`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getApprovedTeachers = async (token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/teacher/approved`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const approveTeacher = async (teacherId, token) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/teacher/approve/${teacherId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
