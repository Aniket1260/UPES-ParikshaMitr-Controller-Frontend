"use client";
import { getSlotDetailsById } from "@/services/exam-slots.service";
import { React, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { controllerToken } from "@/config/temp.config";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SlotDetails = ({ params }) => {
  const router = useRouter();
  const { id: slotId } = params;
  const SlotDetailsQuery = useQuery({
    queryKey: ["slotDetails", slotId],
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
    <div>
      {SlotDetailsQuery.isLoading && <div>Loading...</div>}
      {SlotDetailsQuery.isError && (
        <div>Error: {SlotDetailsQuery.error.message}</div>
      )}
      {SlotDetailsQuery.isSuccess && (
        <div>
          <h2>Slot Details</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {/* Left column */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: "auto auto auto auto",
                gap: "8px",
              }}
            >
              <div>Date:</div>
              <div>{SlotDetailsQuery.data.date}</div>
              <div>Type of Slot:</div>
              <div>{SlotDetailsQuery.data.timeSlot}</div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateRows: "auto auto",
                gap: "8px",
              }}
            >
              <div>Unique Code:</div>
              <div>{SlotDetailsQuery.data.uniqueCode}</div>
            </div>
          </div>

          <Box sx={{ pt: 2 }}>
            <Typography variant="h4">Room Details</Typography>
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
        </div>
      )}
    </div>
  );
};

export default SlotDetails;
