import { BaseUrl } from "@/config/var.config";
import axios from "axios";

export const getAllExamSlots = async (token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/slot`,
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

export const AddExamSlot = async (token, data) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/exam-controller/invigilation/slot`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
