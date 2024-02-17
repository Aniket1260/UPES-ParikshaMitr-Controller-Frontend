"use client";
import {
  getApprovedTeachers,
  getUnapprovedTeachers,
} from "@/services/cont-teacher.service";
import { Box, CircularProgress, Select, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import UnapprovedTeacherList from "./UnapprovedTeacherList";
import { enqueueSnackbar } from "notistack";
import ApprovedTeacherList from "./ApprovedTeacherList";

const TeacherListPage = () => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }
  const unApprovedTeacherResult = useQuery({
    queryKey: ["teachers", { type: "unapproved" }, controllerToken],
    queryFn: () => getUnapprovedTeachers(controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  const approvedTeacherResult = useQuery({
    queryKey: ["teachers", { type: "approved" }, controllerToken],
    queryFn: () => getApprovedTeachers(controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  if (unApprovedTeacherResult.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        unApprovedTeacherResult.error.response.status +
        " : " +
        unApprovedTeacherResult.error.response.data.message,
    });
  }

  if (approvedTeacherResult.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        approvedTeacherResult.error.response.status +
        " : " +
        approvedTeacherResult.error.response.data.message,
    });
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Teachers
      </Typography>
      {unApprovedTeacherResult.isLoading || approvedTeacherResult.isLoading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">Unapproved Teachers</Typography>
          {unApprovedTeacherResult.isSuccess && (
            <UnapprovedTeacherList
              teacherData={unApprovedTeacherResult.data.map((ele, idx) => ({
                ...ele,
                id: idx + 1,
              }))}
            />
          )}
          <Typography variant="h6" sx={{ mt: 5 }}>
            Approved Teachers
          </Typography>
          {approvedTeacherResult.isSuccess && (
            <ApprovedTeacherList
              teacherData={approvedTeacherResult.data.map((ele, idx) => ({
                ...ele,
                id: idx + 1,
              }))}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default TeacherListPage;
