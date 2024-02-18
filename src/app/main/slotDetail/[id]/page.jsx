"use client";
import { React, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getSlotDetailsById } from "@/services/exam-slots.service";
import { QrCode, Search } from "@mui/icons-material";
import { useQRCode } from "next-qrcode";

const SlotDetails = ({ params }) => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { Canvas } = useQRCode();

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
    { field: "room_no", headerName: "Room Number", flex: 0.5 },
    { field: "block", headerName: "Block", flex: 0.5 },
    { field: "floor", headerName: "Floor", flex: 0.5 },
    { field: "students", headerName: "No. of Students", flex: 0.5 },
    {
      field: "invigilators",
      headerName: "Invigilators",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box>
              <Typography variant="body2" color="primary">
                Invigilator 1
              </Typography>
              <Typography variant="h6" component="p">
                {params.value[0] ? params.value[0].name : "Not Assigned"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="primary">
                Invigilator 2
              </Typography>
              <Typography variant="h6" component="p">
                {params.value[1] ? params.value[1].name : "Not Assigned"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
  ];

  const rows = useMemo(() => {
    if (SlotDetailsQuery.data && SlotDetailsQuery.data.rooms) {
      const roomRows = SlotDetailsQuery.data.rooms.map((room, index) => {
        return {
          id: index + 1,
          room_no: room.room_no,
          block: room.block,
          floor: room.floor,
          students: room.students.length,
          invigilators: [
            room.room_invigilator_id.invigilator1_id,
            room.room_invigilator_id.invigilator2_id,
          ],
        };
      });

      if (search) {
        return roomRows.filter((row) => {
          return ("" + row.room_no)
            .toLowerCase()
            .includes(search.toLowerCase());
        });
      }

      return roomRows;
    }
    return [];
  }, [SlotDetailsQuery.data, search]);

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
                  <IconButton onClick={() => setQrModalOpen(true)}>
                    <Tooltip title="Show QR" placement="top" arrow>
                      <QrCode />
                    </Tooltip>
                  </IconButton>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
            <DialogContent>
              <Box>
                <Canvas
                  text={SlotDetailsQuery.data.uniqueCode}
                  options={{
                    errorCorrectionLevel: "H",
                    margin: 1,
                    scale: 10,
                    width: 400,
                    color: {
                      dark: "#000",
                      light: "#fff",
                    },
                  }}
                />
              </Box>
            </DialogContent>
          </Dialog>

          <Box sx={{ pt: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Room Details
            </Typography>
            {SlotDetailsQuery.isLoading && <CircularProgress />}
            {SlotDetailsQuery.isSuccess && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <TextField
                    placeholder="Search Room Nos."
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1, minWidth: 300 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  disableRowSelectionOnClick
                  disableColumnSelector
                  disableColumnFilter
                  rowHeight={120}
                />
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SlotDetails;
