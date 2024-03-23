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

export const getRoomsForSlot = async (token, slotId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/rooms?slot_id=${slotId}`,
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

export const assignRoomsToFlying = async (token, flyingId, roomIds) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/flying/assign-rooms`,
      {
        flying_squad_id: flyingId,
        room_ids: roomIds,
      },
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
