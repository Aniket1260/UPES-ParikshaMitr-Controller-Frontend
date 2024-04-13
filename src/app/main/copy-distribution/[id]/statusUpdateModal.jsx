import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

const StatusUpdateModal = ({ open, onClose, onConfirm, status }) => {
  const queryClient = useQueryClient;
  const mutation = useMutation({
    mutationFn: () => statusChangeService(bundleId, batch, program, status),
    onSuccess: (data) => {
      console.log("Response from statusChangeService API:", data);
      queryClient.invalidateQueries("bundle");
      onConfirm();
      onClose();
    },
    onError: (error) => {
      console.error("Error occurred:", error);
    },
  });

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
      break;
  }

  const handleConfirm = () => {
    mutation.mutate();
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
