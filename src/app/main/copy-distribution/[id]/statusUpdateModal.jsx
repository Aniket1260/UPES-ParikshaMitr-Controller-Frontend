import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { statusChangeService } from "@/services/copy-distribution";

const StatusUpdateModal = ({
  open,
  onClose,
  onConfirm,
  status,
  batch,
  program,
  bundle_id,
}) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }
  const queryClient = useQueryClient();

  const statusChangeMutation = useMutation({
    mutationFn: (statusData) =>
      statusChangeService(controllerToken, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries("bundle");
      handleClose();
      enqueueSnackbar({
        variant: "success",
        message: "Status chnaged successfully",
      });
    },
    onError: (error) => {
      console.log("error", error);
      enqueueSnackbar({
        variant: "error",
        message: error.message,
      });
    },
  });

  const handleClose = () => {
    onClose();
  };

  let message = "";
  let action = "";

  switch (status) {
    case "ALLOTED":
      message = "Mark the status as Started";
      action = "Started";
      break;
    case "INPROGRESS":
    case "OVERDUE":
      message = "Mark the status as submitted";
      action = "Submitted";
      break;
    default:
      return null;
  }

  const handleConfirm = async () => {
    const statusData = {
      bundle_id: bundle_id,
      batch: batch,
      program: program,
    };
    console.log(statusData);
    statusChangeMutation.mutate(statusData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <Box>
          <div>{message}</div>
          <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
            <Button color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
