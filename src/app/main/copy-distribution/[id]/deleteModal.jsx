import React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBundle } from "@/services/copy-distribution";
import { enqueueSnackbar } from "notistack";

const DeleteBundleModal = ({ open, onClose, onDelete, batch, bundle_id }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }
  const queryClient = useQueryClient();

  const deleteBundleMutation = useMutation({
    mutationFn: () => deleteBundle(controllerToken, bundle_id, batch),
    onSuccess: () => {
      queryClient.invalidateQueries("bundle");
      handleClose();
      enqueueSnackbar({
        variant: "success",
        message: "Bundle deleted successfully",
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

  const handleDelete = async () => {
    deleteBundleMutation.mutate();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure you want to Delete?</DialogTitle>
      <DialogContent>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
            <Button color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBundleModal;
