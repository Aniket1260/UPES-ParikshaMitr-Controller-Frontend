"use client";
import { React, useEffect, useMemo, useState } from "react";
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
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DataGrid } from "@mui/x-data-grid";
import {
  AddRoomtoSlotService,
  ChangeRoomsStatusService,
  CreateRoomService,
  approveRoom,
  getSlotDetailsById,
} from "@/services/exam-slots.service";
import {
  Assignment,
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
import AssignTeacherModal from "./assignTeacherModal";
import EditInvigilatorModal from "./editInvigilatorModal";
import DeleteInvigilatorModal from "./deleteInvigilatorModal";
import RemoveIcon from "@mui/icons-material/Remove";

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
  const [addRoomLoading, setAddRoomLoading] = useState(false);
  const [rowSelected, setRowSelected] = useState([]);
  const [selectedStatusChangeModal, setSelectedStatusChangeModal] = useState({
    open: false,
    status: "COMPLETED",
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

  const changeRoomStatusesMutation = useMutation({
    mutationFn: (data) => ChangeRoomsStatusService(controllerToken, data),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Room Status Changed Successfully",
      });
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  const createRoomService = useMutation({
    mutationFn: (data) => CreateRoomService(controllerToken, data),
    onMutate: () => {
      setAddRoomLoading(true);
    },
    onSettled: () => {
      setAddRoomLoading(false);
    },
    onSuccess: async (data) => {
      try {
        const roomidResponse = data.message.split("ID: ")[1];
        const room_id = roomidResponse ? [roomidResponse] : [];
        const roomDetails = {
          slotId: slotId,
          roomIds: room_id,
        };
        console.log(roomDetails);
        await AddRoomtoSlotService(controllerToken, roomDetails);

        queryClient.invalidateQueries("slotDetails");
        enqueueSnackbar({
          variant: "success",
          message: "Room Added Successfully",
        });
      } catch (error) {
        enqueueSnackbar({
          variant: "error",
          message:
            error.response?.status + " : " + error.response?.data.message,
        });
      }
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  const markSelectedRoomsStatusChange = async () => {
    if (rowSelected.length === 0) {
      enqueueSnackbar({
        variant: "warning",
        message: "No Rooms Selected",
      });
      return;
    }

    await changeRoomStatusesMutation.mutateAsync({
      room_ids: rowSelected,
      status: selectedStatusChangeModal.status,
    });
    queryClient.invalidateQueries("slotDetails");
    setSelectedStatusChangeModal({
      open: false,
      status: "COMPLETED",
    });
    setRowSelected([]);
  };

  const submitMarkAllCompleted = async () => {
    setMarkAllCompletedModalOpen((prev) => ({ ...prev, loading: true }));

    // Get all Rooms that are not completed and has at least one invigilator assigned
    // inv1: room.room_invigilator_id.invigilator1_id,
    //       inv2: room.room_invigilator_id.invigilator2_id,
    //       inv3: room.room_invigilator_id.invigilator3_id,
    const rooms = SlotDetailsQuery.data.rooms.filter(
      (room) =>
        room.status !== "COMPLETED" &&
        (room.room_invigilator_id.invigilator1_id ||
          room.room_invigilator_id.invigilator2_id ||
          room.room_invigilator_id.invigilator3_id)
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

  const moreDetails = {
    totalRooms: 0,
    totalStudents: 0,
    invigilatorsAssigned: 0,
    debarredStudents: 0,
    fHoldStudents: 0,
    rHoldStudents: 0,
  };
  const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    roomNo: 0,
    block: "",
    floor: 0,
  });

  const handleAddRoom = () => {
    const newRoomDataCopy = {
      ...newRoomData,
      roomNo: parseInt(newRoomData.roomNo, 10),
      block: "BLOCK-" + newRoomData.block,
      floor: parseInt(newRoomData.floor, 10),
    };
    console.log(newRoomDataCopy);
    setNewRoomData({
      roomNo: 0,
      block: "",
      floor: 0,
    });
    setAddRoomModalOpen(false);
    createRoomService.mutate(newRoomDataCopy);
  };

  const [addDetails, setAddDetails] = useState(moreDetails);

  const getMoreDetails = () => {
    if (SlotDetailsQuery.data && SlotDetailsQuery.data.rooms) {
      const newDetails = SlotDetailsQuery.data.rooms.reduce(
        (acc, room) => {
          acc.totalRooms++;
          acc.totalStudents += room.students.length;
          if (room.room_invigilator_id?.invigilator1_id) {
            acc.invigilatorsAssigned++;
          }
          if (room.room_invigilator_id?.invigilator2_id) {
            acc.invigilatorsAssigned++;
          }
          if (room.room_invigilator_id?.invigilator3_id) {
            acc.invigilatorsAssigned++;
          }
          room.students?.forEach((student) => {
            if (student.eligible === "DEBARRED") {
              acc.debarredStudents++;
            }
            if (student.eligible === "F_HOLD") {
              acc.fHoldStudents++;
            }
            if (student.eligible === "R_HOLD") {
              acc.rHoldStudents++;
            }
          });
          return acc;
        },
        { ...moreDetails }
      );
      setAddDetails(newDetails);
    }
  };

  useEffect(() => {
    getMoreDetails();
  }, [SlotDetailsQuery.data]);

  const [assignTeacherModalOpen, setAssignTeacherModalOpen] = useState(false);
  const [assignTeacherModalData, setAssignTeacherModalData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [deleteInvigilatorModalOpen, setDeleteInvigilatorModalOpen] =
    useState(false);
  const [deleteInvigilatorModalData, setDeleteInvigilatorModalData] =
    useState(null);

  const handleDeleteInviglatorClick = (params) => {
    setSelectedRoom(params.row);
    setDeleteInvigilatorModalOpen(true);
    setDeleteInvigilatorModalData(params.row.room_id);
  };

  const handleAssignTeacherClick = (params) => {
    setSelectedRoom(params.row);
    setAssignTeacherModalOpen(true);
    setAssignTeacherModalData(params.row.room_id);
  };

  const [editInvigilatorModalOpen, setEditInvigilatorModalOpen] =
    useState(false);
  const [editInvigilatorModalData, setEditInvigilatorModalData] =
    useState(null);

  const handleEditInvigilatorClick = (params) => {
    setSelectedRoom(params.row);
    setEditInvigilatorModalOpen(true);
    setEditInvigilatorModalData({
      roomId: params.row.room_id,
      invigilators_num: params.row.num_inv,
    });
  };

  const columns = useMemo(
    () => [
      {
        field: "room_no",
        headerName: "Room Number",
        width: 160,
        renderCell: (params) => {
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
      { field: "block", headerName: "Block", width: 95 },
      { field: "students", headerName: "No. of Students", width: 135 },
      {
        field: "Invigilators",
        headerName: "Invigilators accepted",
        width: 145,
        renderCell: (params) => {
          return (
            <Typography sx={{ fontWeight: 800 }}>
              {params.row.num_inv}
            </Typography>
          );
        },
      },
      {
        field: "inv1",
        headerName: "Invigilator 1",
        // flex: 1,
        width: 175,
        renderCell: (params) => {
          if (params.row.num_inv < 1) {
            return "";
          }
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
        // flex: 1,
        width: 175,
        renderCell: (params) => {
          if (params.row.num_inv < 2) {
            return "";
          }
          return (
            <Typography sx={{ fontWeight: 800 }}>
              {params.value ? params.value.name : "Not Assigned"}
            </Typography>
          );
        },
      },
      {
        field: "inv3",
        headerName: "Invigilator 3",
        // flex: 1,
        width: 175,
        renderCell: (params) => {
          if (params.row.num_inv < 3) {
            return "";
          }
          return (
            <Typography sx={{ fontWeight: 800 }}>
              {params.value ? params.value.name : "Not Assigned"}
            </Typography>
          );
        },
      },

      {
        field: "room_id",
        headerName: "Actions",
        flex: 0.5,
        renderCell: (params) => {
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
              <Tooltip title="Delete Invigilator" placement="top" arrow>
                <IconButton
                  onClick={() => {
                    handleDeleteInviglatorClick(params);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Assign Invigilator" placement="top" arrow>
                <IconButton
                  onClick={() => {
                    handleAssignTeacherClick(params);
                  }}
                >
                  <Assignment />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Edit Number of Invigilators"
                placement="top"
                arrow
              >
                <IconButton
                  onClick={() => {
                    handleEditInvigilatorClick(params);
                  }}
                >
                  <AddCircleOutlineIcon />
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
    console.log(SlotDetailsQuery.data);
    if (SlotDetailsQuery.data && SlotDetailsQuery.data.rooms) {
      const roomRows = SlotDetailsQuery.data.rooms.map((room, index) => {
        return {
          id: index + 1,
          room_id: room._id,
          room_no: room.room_no,
          block: room.block,
          floor: room.floor,
          students: room.students.length,
          inv1: room.room_invigilator_id?.invigilator1_id,
          inv2: room.room_invigilator_id?.invigilator2_id,
          inv3: room.room_invigilator_id?.invigilator3_id,
          status: room.status,
          num_inv: room.num_invigilators,
        };
      });

      if (search) {
        return roomRows.filter((row) => {
          return (
            (row.inv1 &&
              row.inv1.name.toLowerCase().startsWith(search.toLowerCase())) ||
            (row.inv2 &&
              row.inv2.name.toLowerCase().startsWith(search.toLowerCase())) ||
            (row.inv3 &&
              row.inv3.name.toLowerCase().startsWith(search.toLowerCase()))
          );
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
      <EditInvigilatorModal
        room={selectedRoom}
        isOpen={editInvigilatorModalOpen}
        onClose={() => setEditInvigilatorModalOpen(false)}
        invigilators_assigned={editInvigilatorModalData?.invigilators_num}
        roomId={editInvigilatorModalData?.roomId}
      />

      <AssignTeacherModal
        open={assignTeacherModalOpen}
        handleClose={() => setAssignTeacherModalOpen(false)}
        room={selectedRoom}
        roomId={assignTeacherModalData}
        slotId={slotId}
      />
      <DeleteInvigilatorModal
        open={deleteInvigilatorModalOpen}
        handleClose={() => setDeleteInvigilatorModalOpen(false)}
        room={selectedRoom}
        roomId={deleteInvigilatorModalData}
      />
      <ApproveModal
        open={approveModalOpen.open}
        handleClose={() => setApproveModalOpen({ open: false, room: null })}
        room={approveModalOpen.room}
        invigilatorsAssigned={addDetails.invigilatorsAssigned}
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
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h4">Slot Details</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push(`/main/slotDetail/${slotId}/flying`)}
              >
                Manage Flying
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setAddRoomModalOpen(true)}
              >
                Add Room
              </Button>
            </Box>
          </Grid>

          <AddRoomModal
            open={addRoomModalOpen}
            handleClose={() => setAddRoomModalOpen(false)}
            handleAddRoom={handleAddRoom}
            newRoomData={newRoomData}
            setNewRoomData={setNewRoomData}
            loading={addRoomLoading}
          />

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

          <Grid container sx={1}>
            <Grid item xs={2}>
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Total Rooms
              </Typography>
              <Typography variant="h5">
                {SlotDetailsQuery.data.rooms.length}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Total Students
              </Typography>
              <Typography variant="h5">{addDetails.totalStudents}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Invigilators Assigned
              </Typography>
              <Typography variant="h5">
                {addDetails.invigilatorsAssigned}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                Debarred Students
              </Typography>
              <Typography variant="h5">
                {addDetails.debarredStudents}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                F Hold Students
              </Typography>
              <Typography variant="h5">{addDetails.fHoldStudents}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                R Hold Students
              </Typography>
              <Typography variant="h5">{addDetails.rHoldStudents}</Typography>
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
                      placeholder="Search Invigilator Name"
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

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ textTransform: "uppercase", mb: 1 }}
                  >
                    Selected Room Actions
                  </Typography>
                  <Box>
                    <Button
                      variant="contained"
                      disabled={rowSelected.length == 0}
                      onClick={() => {
                        setSelectedStatusChangeModal({
                          open: true,
                          status: "COMPLETED",
                        });
                      }}
                    >
                      Change Room status
                    </Button>
                  </Box>
                </Box>
                <Dialog
                  open={selectedStatusChangeModal.open}
                  onClose={() =>
                    setSelectedStatusChangeModal({
                      open: false,
                      status: "COMPLETED",
                    })
                  }
                >
                  <DialogContent>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Change Selected Rooms&apos; Status To
                      </Typography>

                      <Select
                        value={selectedStatusChangeModal.status}
                        onChange={(e) =>
                          setSelectedStatusChangeModal((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        fullWidth
                      >
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                        <MenuItem value="APPROVAL">Approval</MenuItem>
                        <MenuItem value="INPROGRESS">In Progress</MenuItem>
                      </Select>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                          mt: 2,
                        }}
                      >
                        <Button
                          onClick={() =>
                            setSelectedStatusChangeModal({
                              open: false,
                              status: "COMPLETED",
                            })
                          }
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            markSelectedRoomsStatusChange();
                          }}
                        >
                          Confirm
                        </Button>
                      </Box>
                    </Box>
                  </DialogContent>
                </Dialog>

                {rows.length > 0 && (
                  <Box style={{ height: 600, width: "100%" }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      disableRowSelectionOnClick
                      // disableColumnSelector
                      // disableColumnFilter
                      checkboxSelection
                      rowHeight={60}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                      }}
                      rowSelectionModel={rowSelected}
                      onRowSelectionModelChange={(newSelection) => {
                        setRowSelected(newSelection);
                      }}
                      getRowId={(row) => row.room_id}
                    />
                  </Box>
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

const AddRoomModal = ({
  open,
  handleClose,
  handleAddRoom,
  newRoomData,
  setNewRoomData,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Typography variant="h5">Add Room</Typography>
        <TextField
          label="Room Number"
          type="number"
          fullWidth
          value={newRoomData.roomNo}
          onChange={(e) =>
            setNewRoomData({ ...newRoomData, roomNo: e.target.value })
          }
          sx={{ mb: 2, mt: 3 }}
        />
        <TextField
          label="Block"
          fullWidth
          value={newRoomData.block}
          onChange={(e) =>
            setNewRoomData({ ...newRoomData, block: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <TextField
          label="Floor"
          type="number"
          fullWidth
          value={newRoomData.floor}
          onChange={(e) =>
            setNewRoomData({ ...newRoomData, floor: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <Box mt={2} textAlign="right">
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRoom}
            sx={{ ml: 1 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add Room"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
