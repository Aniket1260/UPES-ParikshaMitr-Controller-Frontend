"use client";
import { controllerToken } from "@/config/temp.config";
import { getUnapprovedTeachers } from "@/services/cont-teacher.service";
import { Box, Select, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UnapprovedTeacherList from "./UnapprovedTeacherList";

const TeacherListPage = () => {
  const unApprovedTeacherResult = useQuery({
    queryKey: ["teachers", "unapproved"],
    queryFn: () => getUnapprovedTeachers(controllerToken),
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
          <Typography>Error: {error.message}</Typography>
        )}{" "}
      </Box>
    </Box>
  );
};

export default TeacherListPage;
