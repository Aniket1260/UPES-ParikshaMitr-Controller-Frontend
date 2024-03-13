"use client";
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

      //TODO: Add invigilator 3
    });
    return rows;
  }, [UnapprovedTeachersQuery.data]);

  const cols = [
    {
      field: "slot_time",
      headerName: "Slot Time",
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
      flex: 1,
    },
    { field: "sap_id", headerName: "SAP ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "scan_date", headerName: "Scan Date", flex: 1 },
    { field: "scan_time", headerName: "Scan Time", flex: 1 },
    {
      field: "_",
      headerName: "Actions",
      flex: 1,
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
        <Box style={{ height: 400, width: "100%" }}>
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
