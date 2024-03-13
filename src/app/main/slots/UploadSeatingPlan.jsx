import {
  AddRoomtoSlotService,
  CreateRoomService,
  UploadSeatPlanService,
} from "@/services/exam-slots.service";
import styled from "@emotion/styled";
import { CloudUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadSeatingPlan = ({ open, handleClose, slot }) => {
  const [csvData, setCsvData] = React.useState(null);
  const [valState, setValState] = React.useState({
    text: "",
    enabled: false,
  });

  const [loadingState, setLoadingState] = React.useState({
    processing: false,
    creatingRooms: {
      processing: false,
      total: 0,
      current: 0,
      error: null,
    },
    uploadSeatPlan: {
      processing: false,
      total: 0,
      current: 0,
      error: null,
    },
    addToSlot: {
      processing: false,
      total: 0,
      current: 0,
      error: null,
    },
  });

  useEffect(() => {
    if (valState.text === "uploadseatingplan") {
      setValState((prev) => ({ ...prev, enabled: true }));
    } else {
      setValState((prev) => ({ ...prev, enabled: false }));
    }
  }, [valState.text]);

  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    // Only upload CSV files
    if (e.target.files[0].name.split(".").pop() !== "csv") {
      alert("Please upload a .csv file");
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      let data = e.target.result;
      data = data.split("\n").slice(1).slice(0, -1);
      data = data.map((ele) => {
        if (ele === "") return;
        ele = ele.trim("\r");
        const [
          prog,
          sem,
          roll,
          sap,
          name,
          batch,
          building,
          room,
          seat,
          sub,
          sub_code,
          eligible,
        ] = ele.split(",");
        return {
          prog,
          sem,
          roll,
          sap,
          name,
          batch,
          building,
          room,
          seat,
          sub,
          sub_code,
          eligible,
        };
      });
      setCsvData(data);
    };
    reader.onloadend = () => {
      enqueueSnackbar({
        variant: "success",
        message: "CSV Parse Successful",
      });
    };
    reader.readAsText(file);
  };

  const { mutateAsync: createRoom } = useMutation({
    mutationFn: (data) => CreateRoomService(controllerToken, data),
    onSuccess: () => {
      setLoadingState((prev) => ({
        ...prev,
        creatingRooms: {
          ...prev.creatingRooms,
          processing: false,
        },
      }));
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
      setLoadingState((prev) => ({
        ...prev,
        processing: false,
        creatingRooms: {
          ...prev.creatingRooms,
          processing: false,
          error: error.response?.status + " : " + error.response?.data.message,
        },
      }));
    },
  });

  const { mutateAsync: uploadSeatingPlan } = useMutation({
    mutationFn: (data) => UploadSeatPlanService(controllerToken, data),
    onSuccess: () => {
      setLoadingState((prev) => ({
        ...prev,
        uploadSeatPlan: {
          ...prev.uploadSeatPlan,
          processing: false,
        },
      }));
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
      setLoadingState((prev) => ({
        ...prev,
        processing: false,
        uploadSeatPlan: {
          ...prev.uploadSeatPlan,
          processing: false,
          error: error.response?.status + " : " + error.response?.data.message,
        },
      }));
    },
  });

  const { mutateAsync: addToSlot } = useMutation({
    mutationFn: (data) => AddRoomtoSlotService(controllerToken, data),
    onSuccess: () => {
      setLoadingState((prev) => ({
        ...prev,
        addToSlot: {
          ...prev.addToSlot,
          processing: false,
        },
      }));
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
      // setLoadingState((prev) => ({
      //   ...prev,
      //   processing: false,
      //   addToSlot: {
      //     ...prev.addToSlot,
      //     processing: false,
      //     error: error,
      //   },
      // }));
    },
  });

  const createRoomHelper = async (roomsToBeCreated) => {
    let roomIds = [];
    setLoadingState((prev) => ({
      ...prev,
      creatingRooms: {
        ...prev.creatingRooms,
        processing: true,
        total: roomsToBeCreated.length,
      },
    }));
    for (let idx = 0; idx < roomsToBeCreated.length; idx++) {
      if (loadingState.creatingRooms.error) {
        return;
      }
      setLoadingState((prev) => ({
        ...prev,
        creatingRooms: {
          ...prev.creatingRooms,
          processing: true,
          current: idx + 1,
        },
      }));
      const res = await createRoom(roomsToBeCreated[idx]);

      roomIds.push({
        id: res.message.split("ID: ")[1],
        roomNo: roomsToBeCreated[idx].roomNo,
      });
    }
    setLoadingState((prev) => ({
      ...prev,
      creatingRooms: {
        processing: false,
        total: roomsToBeCreated.length,
        current: 0,
      },
    }));
    return roomIds;
  };

  const seatingPlanHelper = async (roomData) => {
    setLoadingState((prev) => ({
      ...prev,
      uploadSeatPlan: {
        ...prev.uploadSeatPlan,
        processing: true,
        total: roomData.length,
      },
    }));
    for (let idx = 0; idx < roomData.length; idx++) {
      if (loadingState.uploadSeatPlan.error) {
        return;
      }
      setLoadingState((prev) => ({
        ...prev,
        uploadSeatPlan: {
          ...prev.uploadSeatPlan,
          processing: true,
          current: idx + 1,
        },
      }));
      const res = await uploadSeatingPlan(roomData[idx]);
    }
    setLoadingState((prev) => ({
      ...prev,
      uploadSeatPlan: {
        processing: false,
        total: roomData.length,
        current: 0,
      },
    }));
  };

  const AddToSlotHelper = async (roomIds) => {
    setLoadingState((prev) => ({
      ...prev,
      addToSlot: {
        ...prev.addToSlot,
        processing: true,
        total: roomIds.length,
      },
    }));
    await addToSlot({
      slotId: slot._id,
      roomIds: roomIds.map((ele) => ele.id),
    });
    setLoadingState((prev) => ({
      ...prev,
      addToSlot: {
        processing: false,
        total: roomIds.length,
        current: 0,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoadingState((prev) => ({ ...prev, processing: true }));
    const uniqueRoomsData = new Set(csvData.map((ele) => parseInt(ele.room)));
    const uniqueRoomsSlot = new Set(slot.rooms.map((ele) => ele.room_no));
    // Tooms in data but not in slot

    const notInSlot = [...uniqueRoomsData].filter(
      (x) => !uniqueRoomsSlot.has(x)
    );
    const roomsToBeCreated = [...notInSlot].map((ele) => {
      return {
        roomNo: ele,
        block: csvData.find((x) => parseInt(x.room) === ele).building,
        floor: parseInt(ele.toString().slice(-3, -2)),
      };
    });

    const roomIds = await createRoomHelper(roomsToBeCreated);
    enqueueSnackbar({
      variant: "success",
      message: "Rooms created successfully",
    });
    if (roomIds.length === 0) return;
    const roomData = roomIds.map((ele) => {
      return {
        room_id: ele.id,
        seating_plan: csvData
          .filter((x) => parseInt(x.room) === ele.roomNo)
          .map((x) => {
            return {
              sap_id: parseInt(x.sap),
              roll_no: x.roll,
              student_name: x.name,
              course: x.prog,
              subject: x.sub,
              subject_code: x.sub_code,
              eligible:
                x.eligible === "Y"
                  ? "YES"
                  : x.eligible === "D"
                  ? "DEBARRED"
                  : x.eligible === "F"
                  ? "F_HOLD"
                  : "R_HOLD",
              seat_no: x.seat,
            };
          }),
      };
    });
    await seatingPlanHelper(roomData);
    enqueueSnackbar({
      variant: "success",
      message: "Seating Plan Uploaded Successfully",
    });
    await AddToSlotHelper(roomIds);
    enqueueSnackbar({
      variant: "success",
      message: "Rooms added to Slot Successfully",
    });
    setLoadingState((prev) => ({ ...prev, processing: false }));
    if (
      !loadingState.creatingRooms.error &&
      !loadingState.uploadSeatPlan.error &&
      !loadingState.addToSlot.error
    ) {
      queryClient.invalidateQueries("slots");
      setValState({ text: "", enabled: false });
      handleClose();
    }
  };

  const cols = [
    { field: "roll", headerName: "Roll No", flex: 1 },
    { field: "sap", headerName: "SAP ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "room", headerName: "Room", flex: 1 },
    { field: "seat", headerName: "Seat", flex: 1 },
  ];

  const room_rows = useMemo(() => {
    if (!csvData) return [];
    const uniqueRooms = new Set(csvData.map((ele) => ele.room));
    return [...uniqueRooms].map((ele, idx) => {
      return {
        id: idx,
        room: ele,
        building: csvData.find((x) => x.room === ele).building,
        seats: csvData.filter((x) => x.room === ele).length,
      };
    });
  }, [csvData]);

  const room_cols = [
    { field: "room", headerName: "Room", flex: 1 },
    { field: "building", headerName: "Building", flex: 1 },
    { field: "seats", headerName: "Seats", flex: 1 },
  ];

  return (
    <Dialog
      open={open}
      onClose={() => {
        setCsvData(null);
        handleClose();
      }}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "1000px", // Set your width here
          },
        },
      }}
    >
      <DialogTitle>Upload Seating Plan</DialogTitle>
      <DialogContent>
        <DialogContentText>Upload Seating Plan CSV</DialogContentText>
        <Button
          variant="outlined"
          color="primary"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
          startIcon={<CloudUpload />}
        >
          Upload File
          <VisuallyHiddenInput
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </Button>
        {csvData?.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Seating Plan Preview
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <Box style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={csvData}
                    columns={cols}
                    disableRowSelectionOnClick
                    // disableColumnSelector
                    // disableColumnFilter
                    getRowId={(row) => row.sap}
                    localeText={{ noRowsLabel: "This is a custom message :)" }}
                    sx={{ width: "100%" }}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5]}
                  />
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Box style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={room_rows}
                    columns={room_cols}
                    disableRowSelectionOnClick
                    // disableColumnSelector
                    // disableColumnFilter
                    getRowId={(row) => row.id}
                    localeText={{ noRowsLabel: "This is a custom message :)" }}
                    sx={{ width: "100%" }}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5]}
                  />
                </Box>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Please enter &apos;<b>uploadseatingplan</b>&apos; to Continue
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              label="Message"
              fullWidth
              value={valState.text}
              onChange={(e) => {
                setValState({ text: e.target.value });
              }}
            />
            {loadingState.creatingRooms.processing && (
              <Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Creating Rooms
                </Typography>
                <Typography>
                  {loadingState.creatingRooms.current} of{" "}
                  {loadingState.creatingRooms.total}
                </Typography>
              </Box>
            )}
            {loadingState.uploadSeatPlan.processing && (
              <Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Uploading Seating Plan
                </Typography>
                <Typography>
                  {loadingState.uploadSeatPlan.current} of{" "}
                  {loadingState.uploadSeatPlan.total}
                </Typography>
              </Box>
            )}
            {loadingState.addToSlot.processing && (
              <Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Adding rooms to Slot
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  setCsvData(null);
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  handleSubmit();
                }}
                disabled={loadingState.processing || !valState.enabled}
              >
                Upload
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadSeatingPlan;
