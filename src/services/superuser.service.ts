import axios from "axios";
import { BaseUrl } from "@/config/var.config";

export const getAllControllerService = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/exam-controller`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addControllerService = async (data, token) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/exam-controller/create-super`,
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

export const deleteControllerService = async (id, token) => {
  try {
    const response = await axios.delete(
      `${BaseUrl}/exam-controller/delete/${id}`,
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
