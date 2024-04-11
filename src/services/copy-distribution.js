import { BaseUrl } from "@/config/var.config";
import axios from "axios";

export const uploadBundleService = async (token, data) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/exam-controller/copy-distribution/add-bundles`,
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
