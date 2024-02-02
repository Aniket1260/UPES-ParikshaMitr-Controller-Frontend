import { BaseUrl } from "@/config/var.config";

export const getUnapprovedTeachers = async (token) =>
  await fetch(`${BaseUrl}/exam-controller/teacher/unapproved`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

      // This is the token that is being used to authenticate the user
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
