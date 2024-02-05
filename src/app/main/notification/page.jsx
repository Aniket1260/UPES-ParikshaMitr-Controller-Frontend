"use client";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import SendNotification from "./SendNotification";

const Notification = () => {
  const [sendNotification, setSendNotification] = useState({
    open: false,
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
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
    </Box>
  );
};

export default Notification;
