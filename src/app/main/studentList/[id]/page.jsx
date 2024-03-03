"use client";
import { getStudentListByRoomId } from "@/services/exam-slots.service";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useMemo } from "react";

const StudentListRoomID = ({ params }) => {
  const { id: roomId } = params;
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const StudentListQuery = useQuery({
    queryKey: ["studentList", controllerToken, roomId],
    queryFn: () => getStudentListByRoomId(controllerToken, roomId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
  });

  if (StudentListQuery.isError) {
    enqueueSnackbar("Error fetching student list", { variant: "error" });
  }

  const cols = [
    { field: "sap_id", headerName: "SAP ID", width: 150 },
    { field: "roll_no", headerName: "Roll No.", width: 150 },
    { field: "student_name", headerName: "Name", width: 150 },
  ];

  const rows = useMemo(() => {
    if (StudentListQuery.isSuccess) {
      return StudentListQuery.data;
    }
    return [];
  }, [StudentListQuery.isSuccess, StudentListQuery.data]);

  return (
    <Box>
      <Typography variant="h4">Student List</Typography>
      <Box>
        {StudentListQuery.isLoading && <CircularProgress />}

        {StudentListQuery.isSuccess && (
          <DataGrid
            rows={rows}
            columns={cols}
            disableRowSelectionOnClick
            disableColumnSelector
            disableColumnFilter
            getRowId={(row) => row?.sap_id}
            sx={{ width: "100%" }}
          />
        )}
      </Box>
    </Box>
  );
};

export default StudentListRoomID;
