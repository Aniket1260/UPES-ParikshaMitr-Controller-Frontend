"use client";
import { React, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getSlotDetailsById } from "@/services/exam-slots.service";

const SlotDetails = ({ params }) => {
  const router = useRouter();
  const { id: slotId } = params;

  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const SlotDetailsQuery = useQuery({
    queryKey: ["slotDetails", controllerToken, slotId],
    queryFn: () => getSlotDetailsById(controllerToken, slotId),
  });

  const columns = [
    { field: "room_no", headerName: "Room Number", flex: 1 },
    { field: "block", headerName: "Block", flex: 1 },
    { field: "floor", headerName: "Floor", flex: 1 },
    { field: "students", headerName: "Students", flex: 1 },
  ];

  const rows = useMemo(() => {
    if (SlotDetailsQuery.data && SlotDetailsQuery.data.rooms) {
      const roomRows = SlotDetailsQuery.data.rooms.map((room, index) => ({
        id: index + 1,
        room_no: room.room_no,
        block: room.block,
        floor: room.floor,
        students: room.students.length,
      }));
      return roomRows;
    }
    return [];
  }, [SlotDetailsQuery.data]);

  return (
    <Box>
      {SlotDetailsQuery.isLoading && <CircularProgress />}
      {SlotDetailsQuery.isError && (
        <Typography variant="body2" color="error">
          Error: {SlotDetailsQuery.error.message}
        </Typography>
      )}
      {SlotDetailsQuery.isSuccess && (
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Slot Details
          </Typography>
          <Grid container sx={{ px: 1 }}>
            <Grid item xs={6}>
              <Grid container direction="column" spacing={1}>
                <Typography variant="body2" color="primary">
                  Date
                </Typography>
                <Typography variant="h5">
                  {SlotDetailsQuery.data.date}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  Type of Slot
                </Typography>
                <Typography variant="h5">
                  {SlotDetailsQuery.data.timeSlot}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <Grid container direction="column" spacing={1}>
                <Typography variant="body2" color="primary">
                  Unique Code
                </Typography>
                <Typography variant="h3">
                  {SlotDetailsQuery.data.uniqueCode}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ pt: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Room Details
            </Typography>
            {SlotDetailsQuery.isLoading && <CircularProgress />}
            {SlotDetailsQuery.isSuccess && (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                disableRowSelectionOnClick
                disableColumnSelector
                disableColumnFilter
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SlotDetails;
