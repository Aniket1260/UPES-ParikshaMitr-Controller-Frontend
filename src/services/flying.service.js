import { BaseUrl } from "@/config/var.config";
import axios from "axios";

export const getFlyingDetailsBySlotID = async (token, slotId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/flying/by-slot?slot_id=${slotId}`,
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
