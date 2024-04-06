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

export const disableTeacher = async (teacherId, token) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/teacher/disable/${teacherId}`,
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

export const editTeacher = async (teacherId, data, token) => {
  try {
    const response = await axios.put(
      `${BaseUrl}/exam-controller/teacher/edit/${teacherId}`,
      data,
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

export const getTeacherAttendance = async (token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/teacher/slot-attendance`,
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

export const deleteTeacherService = async (teacherId, token) => {
  try {
    const response = await axios.delete(
      `${BaseUrl}/exam-controller/teacher/delete/${teacherId}`,
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

export const ChangePasswordService = async (data, token) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/exam-controller/teacher/change-password`,
      data,
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

export const getSlotsByDate = async (date, token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/slot/by-date?date=${date}`,
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

export const deleteInvigilatorService = async (data, token) => {
  try {
    const response = await axios.delete(
      `${BaseUrl}/exam-controller/invigilation/delete`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDutyStatusService = async (date, timeslot, token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/teacher/duty-status?date=${date}&timeslot=${timeslot}`,
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
