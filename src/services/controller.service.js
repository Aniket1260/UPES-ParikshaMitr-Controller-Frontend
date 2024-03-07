import { BaseUrl } from "@/config/var.config";
import axios from "axios";

export const getUnapprovedInvigilations = async (token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/room/approve-invigilator`,
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

export const ApproveInvigilationsService = async (token, invigilations) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/room/approve-invigilator`,
      invigilations,
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

export const rejectInvigilationsService = async (token, invigilations) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/room/reject-invigilator`,
      invigilations,
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
