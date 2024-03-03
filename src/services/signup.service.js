import axios from "axios";
import { BaseUrl } from "@/config/var.config";

export const signup = async (formData) => {
  try {
    const { name, username, password } = formData;
    console.log("Calling login API with username:", username);
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
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
