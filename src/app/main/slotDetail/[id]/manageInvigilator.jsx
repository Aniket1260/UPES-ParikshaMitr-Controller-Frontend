import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  Grid,
  Autocomplete,
  TextField,
  Tab,
  Tabs,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ManageInvigilatorModal = ({ open, handleClose }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState("add");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const options = []; // Your options here

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAction = () => {
    if (selectedTab === "add") {
      console.log("Add invigilator");
      handleClose();
    } else {
      console.log("Remove invigilator");
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ width: 400 }}>
        <Typography variant="h6">Manage Invigilator Duties</Typography>

        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab value="add" label="Add" />
          <Tab value="remove" label="Remove" />
        </Tabs>

        <Box my={1} alignItems="center">
          <Autocomplete
            options={options}
            getOptionLabel={(option) => `${option.name}  ${option.sap_id}`}
            onChange={(event, value) => {
              setSelectedTeacher(value);
            }}
            value={selectedTeacher}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search Teachers" />
            )}
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
          <Button variant="contained" onClick={handleAction}>
            {selectedTab === "add" ? "Add" : "Remove"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ManageInvigilatorModal;
