"use client";
import {
  deleteControllerService,
  getAllControllerService,
} from "@/services/superuser.service";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import AddUserModal from "./AddUserModal";
import { refetchInterval } from "@/config/var.config";
import { Delete } from "@mui/icons-material";

const Users = () => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const [addUserModal, setaddUserModal] = useState({
    open: false,
  });

  const GetAllControllerQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllControllerService(),
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteUserMutation } = useMutation({
    mutationFn: (id) => deleteControllerService(id, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "User Deleted Successfully",
      });
      queryClient.invalidateQueries("users");
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  if (GetAllControllerQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        GetAllControllerQuery.error.response?.status +
        " : " +
        GetAllControllerQuery.error.response?.data.message,
    });
  }

  const rows = useMemo(() => {
    return GetAllControllerQuery.data?.map((ele, idx) => ({
      ...ele,
      id: idx + 1,
    }));
  }, [GetAllControllerQuery.data]);

  const cols = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 160,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 260,
    },
    {
      field: "username",
      headerName: "Username",
      minWidth: 160,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 160,
    },
    {
      field: "_",
      headerName: "Action",
      minWidth: 160,
      renderCell: (params) => {
        return (
          <Box>
            <Tooltip title="Delete User">
              <IconButton
                color="error"
                onClick={() => {
                  deleteUserMutation(params.row._id);
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4">Users Page</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setaddUserModal({ open: true })}
          >
            Add User
          </Button>
        </Box>
      </Box>
      {GetAllControllerQuery.isLoading && <CircularProgress />}
      {GetAllControllerQuery.isSuccess && rows.length > 0 && (
        <Box
          style={{
            height: "80vh",
            width: "calc(100vw - 280px)",
          }}
        >
          <DataGrid
            rows={rows}
            columns={cols}
            disableSelectionOnClick
            disableRowSelectionOnClick
          />
        </Box>
      )}
      <AddUserModal
        open={addUserModal.open}
        handleClose={() => setaddUserModal({ open: false })}
      />
    </Box>
  );
};

export default Users;
