import { BaseUrl } from "@/config/var.config";
import axios from "axios";

export const getNotifications = async (token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/get-notifications`,
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

export const sendNotification = async (notification, token) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/exam-controller/create-notification`,
      notification,
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
