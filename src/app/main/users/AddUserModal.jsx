"use client";
import { addControllerService } from "@/services/superuser.service";
import { RemoveRedEye } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

const AddUserModal = ({ open, handleClose }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const [addUserData, setAddUserData] = useState({
    name: "",
    username: "",
    password: "",
    role: "proctor",
  });

  const [viewPassword, setViewPassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: addUserMutation } = useMutation({
    mutationFn: () => addControllerService(addUserData, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "User Added Successfully",
      });
      queryClient.invalidateQueries("users");
      setAddUserData({
        name: "",
        username: "",
        password: "",
        role: "proctor",
      });
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  const handleAddUser = () => {
    if (!addUserData.name || !addUserData.username || !addUserData.password) {
      enqueueSnackbar({
        variant: "error",
        message: "Please fill all the fields",
      });
      return;
    }
    addUserMutation();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <Box mt={1} width={400}>
          <TextField
            label="Name"
            fullWidth
            onChange={(event) =>
              setAddUserData((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </Box>

        <Box mt={2} width={400}>
          <TextField
            label="Username"
            fullWidth
            onChange={(event) =>
              setAddUserData((prev) => ({
                ...prev,
                username: event.target.value,
              }))
            }
          />
        </Box>

        <Box
          mt={2}
          width={400}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            label="Password"
            fullWidth
            type={viewPassword ? "text" : "password"}
            onChange={(event) =>
              setAddUserData((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
          />
          <Tooltip title="Show Password">
            <IconButton onClick={() => setViewPassword((prev) => !prev)}>
              <RemoveRedEye />
            </IconButton>
          </Tooltip>
        </Box>

        <Box mt={1} width={400}>
          <Typography color="primary">Role</Typography>
          <Autocomplete
            options={["admin", "proctor"]}
            defaultValue="proctor"
            onChange={(event, value) => {
              setAddUserData((prev) => ({ ...prev, role: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Role" />
            )}
            popperPlacement="bottom-start"
          />
        </Box>
        <Box mt={3} textAlign="right">
          <Button
            variant="outlined"
            onClick={handleClose}
            style={{ marginRight: "8px" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleAddUser}
            disabled={addUserMutation.isLoading}
            // disabled={!selectedTeacher || assignInvigilatorMutation.isLoading}
          >
            {addUserMutation.isLoading ? "Adding User" : "Add User"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
