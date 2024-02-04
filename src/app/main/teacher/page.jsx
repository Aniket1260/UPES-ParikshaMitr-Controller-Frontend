"use client";
import { controllerToken } from "@/config/temp.config";
import { getUnapprovedTeachers } from "@/services/cont-teacher.service";
import { Box, Select, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UnapprovedTeacherList from "./UnapprovedTeacherList";

const TeacherListPage = () => {
  const unApprovedTeacherResult = useQuery({
    queryKey: ["teachers", { type: "unapproved" }],
    queryFn: () => getUnapprovedTeachers(controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  if (unApprovedTeacherResult.isSuccess)
    console.log(unApprovedTeacherResult.data);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Teachers
      </Typography>
      <Box>
        <Typography variant="h6">Unapproved Teachers</Typography>
        {unApprovedTeacherResult.isLoading && (
          <Typography>Loading...</Typography>
        )}
        {unApprovedTeacherResult.isSuccess && (
          <UnapprovedTeacherList
            teacherData={unApprovedTeacherResult.data.map((ele, idx) => ({
              ...ele,
              id: idx + 1,
            }))}
          />
        )}
        {unApprovedTeacherResult.isError && (
          <Typography>
            Error: {unApprovedTeacherResult.error.response.data.message}
          </Typography>
        )}{" "}
      </Box>
    </Box>
  );
};

export default TeacherListPage;
