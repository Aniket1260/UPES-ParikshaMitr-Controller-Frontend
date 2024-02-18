"use client";
import { getUnapprovedInvigilations } from "@/services/controller.service";
import { Check } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useMemo } from "react";

const ApproveInvigilations = () => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const UnapprovedTeachersQuery = useQuery({
    queryKey: ["unapprovedTeachers", controllerToken],
    queryFn: () => getUnapprovedInvigilations(controllerToken),
  });

  if (UnapprovedTeachersQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        UnapprovedTeachersQuery.error.response.status +
        " : " +
        UnapprovedTeachersQuery.error.response.data.message,
    });
  }

  const rows = useMemo(() => {
    const rows = [];
    let id = 1;
    UnapprovedTeachersQuery.data?.forEach((ele) => {
      console.log(ele);
      if (ele.invigilator1_controller_approval === false) {
        rows.push({
          id: id++,
          room_no: ele.room_no,
          room_id: ele.room_id,
          name: ele.invigilator1.name,
          sap_id: ele.invigilator1.sap_id,
        });
      }
      if (ele.invigilator2_controller_approval === false) {
        rows.push({
          id: id++,
          room_no: ele.room_no,
          room_id: ele.room_id,
          name: ele.invigilator2.name,
          sap_id: ele.invigilator2.sap_id,
        });
      }
    });
    return rows;
  }, [UnapprovedTeachersQuery.data]);
  console.log(rows);

  const cols = [
    {
      field: "room_no",
      headerName: "Room No.",
      flex: 1,
    },
    { field: "sap_id", headerName: "SAP ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "_",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            variant="contained"
            color="primary"
            onClick={() => {
              console.log(params.row);
            }}
          >
            <Tooltip title="Approve Invigilator" arrow placement="top">
              <Check />
            </Tooltip>
          </IconButton>
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
      {UnapprovedTeachersQuery.isSuccess && (
        <DataGrid
          rows={rows}
          columns={cols}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableRowSelectionOnClick
          disableColumnSelector
          disableColumnFilter
        />
      )}
    </Box>
  );
};

export default ApproveInvigilations;
