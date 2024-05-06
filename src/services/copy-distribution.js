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

export const getBundleService = async (token) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/copy-distribution/all-bundles`,
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

export const getBundleByIdService = async (token, bundleId) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/exam-controller/copy-distribution/bundle-by-id?bundle_id=${bundleId}`,
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
export const statusChangeService = async (token, data) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/copy-distribution/progress-bundle`,
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

export const deleteBundle = async (token, bundleId, batch) => {
  try {
    const response = await axios.delete(
      `${BaseUrl}/exam-controller/copy-distribution/delete-bundle?bundle_id=${bundleId}&batch=${batch}`,

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

export const BundleSubmitUpdate = async (token, data) => {
  try {
    const response = await axios.patch(
      `${BaseUrl}/exam-controller/copy-distribution/batch-submit-update`,
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

export const deleteSubjectService = async (token, id) => {
  try {
    const response = await axios.delete(
      `${BaseUrl}/exam-controller/copy-distribution/delete-subject?bundle_id=${id}`,
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
