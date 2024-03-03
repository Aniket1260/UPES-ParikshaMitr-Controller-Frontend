import axios from "axios";
import { BaseUrl } from "@/config/var.config";

export const login = async (username, password) => {
  try {
    console.log("Calling login API with username:", username);
    const response = await axios.post(
      `${BaseUrl}/exam-controller/login`,
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
