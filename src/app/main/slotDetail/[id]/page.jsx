"use client";
import { React, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { approveRoom, getSlotDetailsById } from "@/services/exam-slots.service";
import {
  CheckCircle,
  Checklist,
  Groups3,
  Person4,
  QrCode,
  Refresh,
  Search,
} from "@mui/icons-material";
import { useQRCode } from "next-qrcode";
import ApproveModal from "./approveModal";
import PendingSuppliesModal from "./pendingSuppliesModal";
import { enqueueSnackbar } from "notistack";

const getChipColor = (status) => {
  switch (status) {
    case "APPROVAL":
      return "warning";
    case "INPROGRESS":
      return "info";
    case "COMPLETED":
      return "success";
    case "PENDING_SUPPLIES":
      return "error";
  }
};

const getChipText = (status) => {
  switch (status) {
    case "APPROVAL":
      return "Waiting for Approval";
    case "INPROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "PENDING_SUPPLIES":
      return "Pending Supplies";
  }
};

const SlotDetails = ({ params }) => {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [markAllCompletedModalOpen, setMarkAllCompletedModalOpen] = useState({
    open: false,
    loading: false,
  });
  const [search, setSearch] = useState("");
  const [approveModalOpen, setApproveModalOpen] = useState({
    open: false,
    room: null,
  });

  const [pendingSuppliesModalOpen, setPendingSuppliesModalOpen] = useState({
    open: false,
    room: null,
  });

  const [roomTypeToggle, setRoomTypeToggle] = useState("all");

  const { Canvas } = useQRCode();
  const queryClient = useQueryClient();

  const router = useRouter();
  const { id: slotId } = params;

  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const mutation = useMutation({
    mutationFn: (id) => approveRoom(id, controllerToken),

    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  const submitMarkAllCompleted = async () => {
    setMarkAllCompletedModalOpen((prev) => ({ ...prev, loading: true }));

    // Get all Rooms that are not completed
    const rooms = SlotDetailsQuery.data.rooms.filter(
      (room) => room.status !== "COMPLETED"
    );

    // If there are no rooms to mark as completed, return
    if (rooms.length === 0) {
      enqueueSnackbar({
        variant: "warning",
        message: "No Rooms to Mark as Completed",
      });
      setMarkAllCompletedModalOpen({
        open: false,
        loading: false,
      });
      return;
    }

    // Mark all rooms as completed
    for (const room of rooms) {
      // Call the API to mark the room as completed
      await mutation.mutateAsync(room?._id);
    }
    queryClient.invalidateQueries("slotDetails");
    enqueueSnackbar({
      variant: "success",
      message: "All Rooms Marked as Completed",
    });

    setMarkAllCompletedModalOpen({
      open: false,
      loading: false,
    });
  };

  const SlotDetailsQuery = useQuery({
    queryKey: ["slotDetails", controllerToken, slotId],
    queryFn: () => getSlotDetailsById(controllerToken, slotId),
  });

  const columns = useMemo(
    () => [
      {
        field: "room_no",
        headerName: "Room Number",
        width: 200,
        renderCell: (params) => {
          console.log(params);
          return (
            <>
              <Typography mr={1}>{params.value}</Typography>
              {params.row.status === "APPROVAL" ? (
                <Chip
                  variant="soft"
                  label={getChipText(params.row.status)}
                  color={getChipColor(params.row.status)}
                  onClick={() =>
                    setApproveModalOpen({
                      open: true,
                      room: params.row,
                    })
                  }
                />
              ) : params.row.status === "PENDING_SUPPLIES" ? (
                <Chip
                  variant="soft"
                  label={getChipText(params.row.status)}
                  color={getChipColor(params.row.status)}
                  onClick={() =>
                    setPendingSuppliesModalOpen({
                      open: true,
                      room: params.row,
                    })
                  }
                />
              ) : (
                <Chip
                  variant="soft"
                  label={getChipText(params.row.status)}
                  color={getChipColor(params.row.status)}
                />
              )}
            </>
          );
        },
      },
      { field: "block", headerName: "Block", width: 120 },
      { field: "floor", headerName: "Floor", width: 120 },
      { field: "students", headerName: "No. of Students", width: 150 },
      {
        field: "inv1",
        headerName: "Invigilator 1",
        flex: 1,
        renderCell: (params) => {
          return (
            <Typography sx={{ fontWeight: 800 }}>
              {params.value ? params.value.name : "Not Assigned"}
            </Typography>
          );
        },
      },
      {
        field: "inv2",
        headerName: "Invigilator 2",
        flex: 1,
        renderCell: (params) => {
          return (
            <Typography sx={{ fontWeight: 800 }}>
              {params.value ? params.value.name : "Not Assigned"}
            </Typography>
          );
        },
      },
      // {
      //   field: "inv3",
      //   headerName: "Invigilator 3",
      //   flex: 1,
      //   renderCell: (params) => {
      //     return (
      //       <Typography sx={{ fontWeight: 800 }}>
      //         {params.value ? params.value.name : "Not Assigned"}
      //       </Typography>
      //     );
      //   },
      // },

      {
        field: "room_id",
        headerName: "Actions",
        flex: 0.5,
        renderCell: (params) => {
          console.log("Actions", params);
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
                color: "blue",
              }}
            >
              <Tooltip title="Student List" placement="top" arrow>
                <IconButton
                  onClick={() =>
                    router.push(`/main/studentList/${params.value}`)
                  }
                >
                  <Groups3 />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [router]
  );

  const rows = useMemo(() => {
    if (SlotDetailsQuery.data && SlotDetailsQuery.data.rooms) {
      const roomRows = SlotDetailsQuery.data.rooms.map((room, index) => {
        return {
          id: index + 1,
          room_id: room._id,
          room_no: room.room_no,
          block: room.block,
          floor: room.floor,
          students: room.students.length,
          inv1: room.room_invigilator_id.invigilator1_id,
          inv2: room.room_invigilator_id.invigilator2_id,
          inv3: room.room_invigilator_id.invigilator3_id,
          status: room.status,
        };
      });

      if (search) {
        return roomRows.filter((row) => {
          return ("" + row.room_no)
            .toLowerCase()
            .startsWith(search.toLowerCase());
        });
      }

      if (roomTypeToggle !== "all") {
        return roomRows.filter((row) => row.status === roomTypeToggle);
      }

      const statusOrder = [
        "PENDING_SUPPLIES",
        "APPROVAL",
        "INPROGRESS",
        "COMPLETED",
      ];

      roomRows.sort((a, b) => {
        const aIndex = statusOrder.indexOf(a.status);
        const bIndex = statusOrder.indexOf(b.status);

        if (aIndex !== -1 || bIndex !== -1) {
          // If a.status or b.status is in statusOrder, sort by the order defined in statusOrder
          return aIndex - bIndex;
        } else {
          // If neither a.status nor b.status is in statusOrder, sort alphabetically
          return a.status.localeCompare(b.status);
        }
      });

      return roomRows;
    }
    return [];
  }, [SlotDetailsQuery.data, search, roomTypeToggle]);

  return (
    <Box>
      <ApproveModal
        open={approveModalOpen.open}
        handleClose={() => setApproveModalOpen({ open: false, room: null })}
        room={approveModalOpen.room}
        setRoom={(room) =>
          setApproveModalOpen((prev) => ({ ...prev, room: room }))
        }
      />
      <PendingSuppliesModal
        open={pendingSuppliesModalOpen.open}
        handleClose={() =>
          setPendingSuppliesModalOpen({ open: false, room: null })
        }
        room={pendingSuppliesModalOpen.room}
        setRoom={(room) =>
          setPendingSuppliesModalOpen((prev) => ({ ...prev, room: room }))
        }
      />

      <MarkAllCompletedModal
        open={markAllCompletedModalOpen.open}
        handleClose={() =>
          setMarkAllCompletedModalOpen({ open: false, loading: false })
        }
        submitHandler={submitMarkAllCompleted}
        loading={markAllCompletedModalOpen.loading}
      />

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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    {SlotDetailsQuery.data.date}
                  </Typography>
                  <Typography variant="h6">
                    {" "}
                    {SlotDetailsQuery.data.timeSlot}
                  </Typography>
                </Box>
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
                <Typography
                  variant="h3"
                  sx={{
                    textAlign: "center",
                    mt: 2,
                  }}
                >
                  {SlotDetailsQuery.data.uniqueCode}
                </Typography>
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box>
                    <ToggleButtonGroup
                      color="primary"
                      value={roomTypeToggle}
                      onChange={(event, newRoomTypeToggle) => {
                        if (newRoomTypeToggle === null) {
                          setRoomTypeToggle("all");
                          return;
                        }
                        setRoomTypeToggle(newRoomTypeToggle);
                      }}
                      exclusive
                    >
                      <ToggleButton value="all">
                        All : {SlotDetailsQuery.data.rooms.length}
                      </ToggleButton>
                      <ToggleButton value="PENDING_SUPPLIES">
                        Pending :{" "}
                        {
                          SlotDetailsQuery.data.rooms.filter(
                            (room) => room.status === "PENDING_SUPPLIES"
                          ).length
                        }
                      </ToggleButton>
                      <ToggleButton value="APPROVAL">
                        Approval :{" "}
                        {
                          SlotDetailsQuery.data.rooms.filter(
                            (room) => room.status === "APPROVAL"
                          ).length
                        }
                      </ToggleButton>
                      <ToggleButton value="INPROGRESS">
                        In Progress :{" "}
                        {
                          SlotDetailsQuery.data.rooms.filter(
                            (room) => room.status === "INPROGRESS"
                          ).length
                        }
                      </ToggleButton>
                      <ToggleButton value="COMPLETED">
                        Completed :{" "}
                        {
                          SlotDetailsQuery.data.rooms.filter(
                            (room) => room.status === "COMPLETED"
                          ).length
                        }
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                  <Box>
                    <Tooltip title="Refresh Data" placement="top">
                      <IconButton
                        sx={{ mr: 2 }}
                        onClick={() =>
                          queryClient.invalidateQueries("slotDetails")
                        }
                      >
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Mark All Rooms Completed" placement="top">
                      <IconButton
                        sx={{ mr: 2 }}
                        onClick={() =>
                          setMarkAllCompletedModalOpen({
                            open: true,
                            loading: false,
                          })
                        }
                      >
                        <Checklist />
                      </IconButton>
                    </Tooltip>
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
                </Box>
                {rows.length > 0 && (
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    disableColumnSelector
                    disableColumnFilter
                    rowHeight={60}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 25 } },
                    }}
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SlotDetails;

const MarkAllCompletedModal = ({
  open,
  handleClose,
  submitHandler,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Mark All Rooms Completed
          </Typography>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ mr: 2 }}>
                Marking all rooms as completed...
              </Typography>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Are you sure you want to mark all rooms as completed?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitHandler}
                >
                  Confirm
                </Button>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
