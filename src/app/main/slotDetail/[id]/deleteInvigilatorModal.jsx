import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";

const DeleteInvigilatorModal = ({ open, handleClose, roomId, room }) => {
  const handleSelect = async () => {
    const deleteDetails = {
      roomId: roomId,
      invigilatorId: room.inv1._id,
    };
    console.log(deleteDetails);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ width: 400 }}>
        <Typography variant="h6">Do you want to delete invigilator?</Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box my={1} alignItems="center">
              <Typography color="primary">Room Number</Typography>
              <Typography variant="subtitle">{room.room_no}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Box my={1} alignItems="center">
          <Typography color="primary">Invigilator Name</Typography>
          <Typography variant="subtitle">{room.inv1.name}</Typography>
        </Box>

        <Box mt={3} textAlign="right">
          <Button
            variant="outlined"
            onClick={handleClose}
            style={{ marginRight: "8px" }}
          >
            Close
          </Button>
          <Button variant="contained" onClick={handleSelect}>
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvigilatorModal;
