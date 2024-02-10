"use client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendNotification } from "@/services/notification.service";
import { controllerToken } from "@/config/temp.config";
import { enqueueSnackbar } from "notistack";

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

const SendNotification = ({ open, handleClose }) => {
  const [notification, setNotification] = useState({
    title: "",
    message: "",
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (notification) =>
      sendNotification(notification, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Notification Sent Successfully",
      });
      queryClient.invalidateQueries("notifications");
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.message,
      });
    },
    onSettled: () => {
      closeDialog();
    },
  });

  const handleFileChange = (e) => {
    if (e.target.files[0].type !== "text/plain") {
      alert("Please upload a .txt file");
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setNotification((prev) => ({ ...prev, message: e.target.result }));
    };
    reader.readAsText(file);
  };

  const closeDialog = () => {
    setNotification({ title: "", message: "" });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Send new notification</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          sx={{ minWidth: 300, my: 2 }}
          value={notification.title}
          onChange={(e) =>
            setNotification((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <TextField
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={notification.message}
          onChange={(e) =>
            setNotification((prev) => ({ ...prev, message: e.target.value }))
          }
        />
        {/* Option to upload a text file that fills description */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          OR fill message by uploading a .txt file
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component="label"
          sx={{ mt: 2 }}
          startIcon={<CloudUploadIcon />}
        >
          Upload File
          <VisuallyHiddenInput
            type="file"
            accept=".txt"
            onChange={handleFileChange}
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          onClick={() =>
            mutate({ title: notification.title, message: notification.message })
          }
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendNotification;
