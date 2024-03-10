import { BaseUrl } from "@/config/var.config";
import axios from "axios";

export const GetAllUFMService = async (controllerToken) => {
  try {
    const response = await axios.get(`${BaseUrl}/ufm/get-ufms`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${controllerToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUFMBySlotService = async (slotId, controllerToken) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/ufm/get-ufms-by-slot?slot_id=${slotId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${controllerToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUFMByIdService = async (ufmId, controllerToken) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/ufm/get-ufms-by-id?id=${ufmId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${controllerToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
