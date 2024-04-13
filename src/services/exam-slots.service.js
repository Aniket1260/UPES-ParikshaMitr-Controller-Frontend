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

export const getSlotDetailsById = async (token, slotId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/slot/${slotId}`,
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
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const CreateRoomService = async (token, data) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/exam-controller/invigilation/room`,
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

export const UploadSeatPlanService = async (token, data) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/room/create-seating-plan`,
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

export const AddRoomtoSlotService = async (token, data) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/slot/add-room`,
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
export const getRoomDetailsById = async (token, roomId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/room/total-supplies?room_id=${roomId}`,
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

export const approveRoom = async (roomId, token) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/exam-controller/invigilation/room/approve-submission`,
      {
        room_id: roomId,
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

export const getSlotContacts = async (token, slotId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/contact-details?slot_id=${slotId}`,
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

export const EditSlotContacts = async (token, data) => {
  try {
    const response = await axios.put(
      `${BaseUrl}/exam-controller/invigilation/contact-details`,
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
export const getPendingSupplies = async (token, roomId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/room/supplies?room_id=${roomId}`,
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

export const getStudentListByRoomId = async (token, roomId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/room/student-list?room_id=${roomId}`,
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
export const UpdateStudentEligibility = async (token, student) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/room/edit-student-eligibility`,
      student,
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

export const DeleteSlotService = async (token, slotId) => {
  try {
    const response = await axios.delete(
      `${BaseUrl}/exam-controller/invigilation/slot/delete/${slotId}`,
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

export const ChangeRoomsStatusService = async (token, data) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/room/change-statuses`,
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

export const UploadDutyService = async (token, data) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/exam-controller/invigilation/slot/duty-sheet-upload`,
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
export const AddStudentService = async (token, data) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/room/add-student`,
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

export const GetInvigilatorsInSlotService = async (token, slotId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/invigilation/inv-in-slot?slot_id=${slotId}`,
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

export const addInvDutytoSlotService = async (token, data) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/add-duty`,
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

export const removeInvDutyfromSlotService = async (token, data) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/invigilation/remove-duty`,
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
