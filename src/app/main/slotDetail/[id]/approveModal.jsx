import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

const ApproveModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Approve Submission</DialogTitle>
      <DialogContent>Approve Modal</DialogContent>
    </Dialog>
  );
};

export default ApproveModal;
