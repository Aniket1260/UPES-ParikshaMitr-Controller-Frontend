"use client";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import SendNotification from "./SendNotification";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notification.service";
import { DataGrid } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
import { Search } from "@mui/icons-material";
import { format } from "date-fns";

const Notification = () => {
  const [sendNotification, setSendNotification] = useState({
    open: false,
  });
  const [search, setSearch] = useState("");
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const notificationRes = useQuery({
    queryKey: ["notifications", controllerToken],
    queryFn: () => getNotifications(controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  if (notificationRes.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        notificationRes.error.response?.status +
        " : " +
        notificationRes.error.response?.data.message,
    });
  }

  const cols = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "message", headerName: "Message", flex: 1 },
    {
      field: "sender.name",
      headerName: "Sender",
      flex: 1,
      renderCell: ({ row }) => {
        return row?.sender?.name;
      },
    },
    {
      field: "createdAt",
      headerName: "Sent At",
      flex: 0.5,
      renderCell: (params) => {
        return format(new Date(params.value), "do MMM yyyy");
      },
    },
  ];

  const rows = useMemo(() => {
    return notificationRes.data?.data?.notifications
      .map((ele, idx) => ({
        ...ele,
        id: idx + 1,
      }))
      .filter((row) => {
        return (
          row.title.toLowerCase().includes(search.toLowerCase()) ||
          row.message.toLowerCase().includes(search.toLowerCase())
        );
      });
  }, [search, notificationRes.data?.data?.notifications]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">Notifications</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              setSendNotification((prev) => ({ ...prev, open: true }))
            }
          >
            Send Notification
          </Button>
          <SendNotification
            open={sendNotification.open}
            handleClose={() =>
              setSendNotification((prev) => ({ ...prev, open: false }))
            }
          />
        </Box>
      </Box>
      {notificationRes.isLoading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <TextField
              placeholder="Search Notifications"
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1, minWidth: 300 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Box>
            {rows.length > 0 && (
              <DataGrid
                rows={rows}
                columns={cols}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                disableRowSelectionOnClick
                disableColumnSelector
                disableColumnFilter
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Notification;
