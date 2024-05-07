"use client";
import {
  addControllerService,
  changeRoleService,
} from "@/services/superuser.service";
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
import React, { useEffect, useState } from "react";

const ChangeRoleModal = ({ open, handleClose, row }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const [addUserData, setAddUserData] = useState({
    name: "",
    username: "",
    password: "",
    role: "proctor",
  });

  useEffect(() => {
    if (row) {
      setAddUserData((prev) => ({
        ...prev,
        role: row.role,
      }));
      console.log(row);
    }
  }, [row]);

  const [viewPassword, setViewPassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: ChangeRoleMutation } = useMutation({
    mutationFn: () =>
      changeRoleService(row._id, addUserData.role, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Role Changed Successfully",
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

  const handleChangeRole = () => {
    ChangeRoleMutation();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        {!row && <Typography>No User Selected</Typography>}
        {row && (
          <>
            <Box mt={1} width={400}>
              <TextField label="Name" disabled fullWidth value={row.name} />
            </Box>

            <Box mt={2} width={400}>
              <TextField
                label="Username"
                disabled
                fullWidth
                value={row.username}
              />
            </Box>

            <Box mt={1} width={400}>
              <Typography color="primary">Role</Typography>
              <Autocomplete
                options={["admin", "proctor"]}
                defaultValue={row.role}
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
                onClick={handleChangeRole}
                disabled={ChangeRoleMutation.isLoading}
                // disabled={!selectedTeacher || assignInvigilatorMutation.isLoading}
              >
                {ChangeRoleMutation.isLoading ? "Adding User" : "Add User"}
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeRoleModal;
