"use client";
import { refetchInterval } from "@/config/var.config";
import {
  ApproveInvigilationsService,
  getUnapprovedInvigilations,
  rejectInvigilationsService,
} from "@/services/controller.service";
import { Cancel, Check } from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useMemo } from "react";

const ApproveInvigilations = () => {
  const queryClient = useQueryClient();

  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const { mutate: approveInvigilations } = useMutation({
    mutationFn: (data) => ApproveInvigilationsService(controllerToken, data),
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Invigilations Approved Successfully",
      });
      queryClient.invalidateQueries("unapprovedTeachers");
    },
  });

  const { mutate: rejectInvigilations } = useMutation({
    mutationFn: (data) => rejectInvigilationsService(controllerToken, data),
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Invigilations Rejected Successfully",
      });
      queryClient.invalidateQueries("unapprovedTeachers");
    },
  });

  const UnapprovedTeachersQuery = useQuery({
    queryKey: ["unapprovedTeachers", controllerToken],
    queryFn: () => getUnapprovedInvigilations(controllerToken),
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
  });

  if (UnapprovedTeachersQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        UnapprovedTeachersQuery.error.response?.status +
        " : " +
        UnapprovedTeachersQuery.error.response?.data.message,
    });
  }

  const rows = useMemo(() => {
    const rows = [];
    let id = 1;
    UnapprovedTeachersQuery.data?.forEach((ele) => {
      if (ele.invigilator1_controller_approval === false) {
        rows.push({
          id: id++,
          room_no: ele.room_no,
          room_id: ele.room_id,
          invigilator_id: ele.invigilator1.id,
          name: ele.invigilator1.name,
          sap_id: ele.invigilator1.sap_id,
          slot_time: ele.slot_time,
          scan_time: ele.invigilator1?.scan_time,
          scan_date: ele.invigilator1?.scan_date,
        });
      }
      if (ele.invigilator2_controller_approval === false) {
        rows.push({
          id: id++,
          room_no: ele.room_no,
          room_id: ele.room_id,
          name: ele.invigilator2.name,
          sap_id: ele.invigilator2.sap_id,
          invigilator_id: ele.invigilator2.id,
          slot_time: ele.slot_time,
          scan_time: ele.invigilator2?.scan_time,
          scan_date: ele.invigilator2?.scan_date,
        });
      }

      if (ele.invigilator3_controller_approval === false) {
        rows.push({
          id: id++,
          room_no: ele.room_no,
          room_id: ele.room_id,
          name: ele.invigilator3.name,
          sap_id: ele.invigilator3.sap_id,
          invigilator_id: ele.invigilator3.id,
          slot_time: ele.slot_time,
          scan_time: ele.invigilator3?.scan_time,
          scan_date: ele.invigilator3?.scan_date,
        });
      }
    });
    return rows;
  }, [UnapprovedTeachersQuery.data]);

  const cols = [
    {
      field: "slot_time",
      headerName: "Slot Time",
      minWidth: 160,
      renderCell: (params) => {
        return (
          <Chip
            variant="soft"
            label={params.value}
            color={
              params.value === "Morning"
                ? "info"
                : params.value === "Afternoon"
                ? "secondary"
                : "primary"
            }
          />
        );
      },
    },
    {
      field: "room_no",
      headerName: "Room No.",
      minWidth: 150,
    },
    { field: "sap_id", headerName: "SAP ID", minWidth: 150 },
    { field: "name", headerName: "Name", minWidth: 170 },
    { field: "scan_date", headerName: "Scan Date", minWidth: 170 },
    { field: "scan_time", headerName: "Scan Time", minWidth: 170 },
    {
      field: "_",
      headerName: "Actions",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <>
            <Tooltip title="Approve Invigilator" arrow placement="top">
              <IconButton
                variant="contained"
                color="primary"
                onClick={() => {
                  approveInvigilations({
                    roomId: params.row.room_id,
                    invigilatorId: params.row.invigilator_id,
                  });
                }}
              >
                <Check />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Invigilator" arrow placement="top">
              <IconButton
                variant="contained"
                color="error"
                onClick={() => {
                  rejectInvigilations({
                    roomId: params.row.room_id,
                    invigilatorId: params.row.invigilator_id,
                  });
                }}
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Approve Invigilations
      </Typography>
      {UnapprovedTeachersQuery.isLoading && <CircularProgress />}
      {UnapprovedTeachersQuery.isSuccess && rows.length > 0 && (
        <Box
          style={{
            height: "80vh",
            width: "calc(100vw - 280px)",
          }}
        >
          <DataGrid
            rows={rows}
            columns={cols}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            disableRowSelectionOnClick
            // disableColumnSelector
            // disableColumnFilter
          />
        </Box>
      )}
    </Box>
  );
};

export default ApproveInvigilations;
