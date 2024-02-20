import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

const ApproveModal = ({ open, handleClose, room }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Approve Submission</DialogTitle>
      <DialogContent>Approve Modal. Room ID: {room?.room_id}</DialogContent>
    </Dialog>
  );
};

export default ApproveModal;
