"use client";
import {
  getApprovedTeachers,
  getUnapprovedTeachers,
} from "@/services/cont-teacher.service";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import UnapprovedTeacherList from "./UnapprovedTeacherList";
import { enqueueSnackbar } from "notistack";
import ApprovedTeacherList from "./ApprovedTeacherList";
import { EventAvailable } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { refetchInterval } from "@/config/var.config";

const TeacherListPage = () => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }
  const router = useRouter();
  const unApprovedTeacherResult = useQuery({
    queryKey: ["teachers", { type: "unapproved" }, controllerToken],
    queryFn: () => getUnapprovedTeachers(controllerToken),
    retry: 2,
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
  });

  const approvedTeacherResult = useQuery({
    queryKey: ["teachers", { type: "approved" }, controllerToken],
    queryFn: () => getApprovedTeachers(controllerToken),
    retry: 2,
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
  });

  if (unApprovedTeacherResult.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        unApprovedTeacherResult.error.response?.status +
        " : " +
        unApprovedTeacherResult.error.response?.data.message,
    });
  }

  if (approvedTeacherResult.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        approvedTeacherResult.error.response?.status +
        " : " +
        approvedTeacherResult.error.response?.data.message,
    });
  }

  return (
    <Box>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Teachers{" "}
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Quick Actions </Typography>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            onClick={() => router.push("teacher/attendance-report")}
          >
            View Attendance Report
          </Button>
        </Box>
      </Box>
      {unApprovedTeacherResult.isLoading || approvedTeacherResult.isLoading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {unApprovedTeacherResult.isSuccess &&
            Array.isArray(unApprovedTeacherResult.data) &&
            unApprovedTeacherResult.data.length > 0 && (
              <>
                <Typography variant="h6">Unapproved Teachers</Typography>
                <UnapprovedTeacherList
                  teacherData={unApprovedTeacherResult.data.map((ele, idx) => ({
                    ...ele,
                    id: idx + 1,
                  }))}
                />
              </>
            )}
          {approvedTeacherResult.isSuccess &&
            Array.isArray(approvedTeacherResult.data) &&
            approvedTeacherResult.data.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 5 }}>
                  Approved Teachers
                </Typography>
                <ApprovedTeacherList
                  teacherData={approvedTeacherResult.data.map((ele, idx) => ({
                    ...ele,
                    id: idx + 1,
                  }))}
                />
              </>
            )}
        </Box>
      )}
    </Box>
  );
};

export default TeacherListPage;
