import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";

const CompleteFlyingModal = ({ isOpen, onClose, flying }) => {
  const handleComplete = () => {
    const flyingDetails = {
      slot_id: flying.slot,
      teacher_id: flying.teacher_id._id,
    };
    console.log("Details:", flyingDetails);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Complete Duty Of Flying</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography>
            Are you sure you want to complete the duty of this flying?
          </Typography>
          <Typography color="primary" variant="body1" mt={2}>
            Name
          </Typography>
          <Typography variant="h6"> {flying?.teacher_id?.name}</Typography>

          <Typography color="primary" variant="body1" mt={1}>
            Rooms Assigned
          </Typography>
          {flying?.rooms_assigned.map((room) => (
            <Typography key={room.room_id._id} variant="h6">
              {room.room_id.room_no}
            </Typography>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleComplete} variant="contained">
          Complete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompleteFlyingModal;
