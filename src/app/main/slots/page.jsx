"use client";
import { controllerToken } from "@/config/temp.config";
import { getAllExamSlots } from "@/services/exam-slots.service";
import { Visibility } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useMemo } from "react";

const ExamSlots = () => {
  const SlotQuery = useQuery({
    queryKey: ["slots"],
    queryFn: () => getAllExamSlots(controllerToken),
  });

  const rows = useMemo(() => {
    console.log(SlotQuery.data);
    return SlotQuery.data?.map((ele, idx) => ({
      ...ele,
      id: idx + 1,
    }));
  }, [SlotQuery.data]);

  const cols = [
    {
      field: "date",
      headerName: "Slot Date",
      flex: 1,
      renderCell: (params) => {
        return format(new Date(params.value), "do MMM yyyy");
      },
    },
    {
      field: "timeSlot",
      headerName: "Slot Type",
      flex: 1,
    },
    {
      field: "uniqueCode",
      headerName: "Unique Code",
      flex: 1,
    },
    {
      field: "rooms",
      headerName: "No. of Rooms Alloted",
      flex: 0.5,
      renderCell: ({ row }) => {
        return row?.rooms?.length;
      },
    },
    {
      field: "_",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Tooltip title="View Slot Details" placement="top" arrow>
              <IconButton>
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4">Examination slots</Typography>
      <Box sx={{ pt: 2 }}>
        {SlotQuery.isLoading && <CircularProgress />}
        {SlotQuery.isSuccess && (
          <DataGrid
            rows={rows}
            columns={cols}
            pageSize={15}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            disableRowSelectionOnClick
            disableColumnSelector
            disableColumnFilter
          />
        )}
      </Box>
    </Box>
  );
};

export default ExamSlots;
