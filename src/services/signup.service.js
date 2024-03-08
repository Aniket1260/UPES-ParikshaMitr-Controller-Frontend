import axios from "axios";
import { BaseUrl } from "@/config/var.config";

export const signup = async (formData) => {
  try {
    const { name, username, password } = formData;
    const response = await axios.post(
      `${BaseUrl}/exam-controller`,
      {
        name: name,
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
