import styled from "@emotion/styled";
import { CloudUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import React from "react";

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
        const [prog, sem, roll, sap, name, batch, building, room, seat] =
          ele.split(",");
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

  const handleSubmit = () => {
    const uniqueRoomsData = new Set(csvData.map((ele) => parseInt(ele.room)));
    const uniqueRoomsSlot = new Set(slot.rooms.map((ele) => ele.room_no));
    console.log(slot, uniqueRoomsSlot, uniqueRoomsData);
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

    console.log(roomsToBeCreated);
  };

  const cols = [
    { field: "roll", headerName: "Roll No", flex: 1 },
    { field: "sap", headerName: "SAP ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "room", headerName: "Room", flex: 1 },
    { field: "seat", headerName: "Seat", flex: 1 },
  ];

  return (
    <Dialog
      open={open}
      onClose={() => {
        setCsvData(null);
        handleClose();
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
            <DataGrid
              rows={csvData}
              columns={cols}
              disableRowSelectionOnClick
              disableColumnSelector
              disableColumnFilter
              getRowId={(row) => row.sap}
              localeText={{ noRowsLabel: "This is a custom message :)" }}
              sx={{ width: "500px" }}
              initialState={{
                pagination: { pageSize: 5 },
              }}
              pageSizeOptions={[5]}
            />
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
