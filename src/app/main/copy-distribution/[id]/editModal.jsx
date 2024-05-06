import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const EditModalDetails = ({ rowData, open, onClose }) => {
  const [editedData, setEditedData] = useState({
    id: rowData ? rowData.id : "",
    batch: rowData ? rowData.batch : "",
    program: rowData ? rowData.program : "",
    noOfStudents: "",
    distributor: rowData ? rowData.distibuter : "",
    status: rowData ? rowData.status : "",
    availableDate: rowData ? rowData.availableDate : "",
    allottedDate: rowData ? rowData.allottedDate : "",
    startDate: rowData ? rowData.startDate : "",
  });
  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    if (rowData) {
      setEditedData((prevData) => ({
        ...prevData,
        batch: rowData.batch,
        program: rowData.program,
        noOfStudents: rowData.numStudents,
        distributor: rowData.distibuter,
        status: rowData.status,
        availableDate: rowData.availableDate,
        allottedDate: rowData.allottedDate,
        startDate: rowData.startDate,
      }));
    }
  }, [rowData]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    console.log("Edited data:", editedData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setIsChanged(true);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Details</DialogTitle>
      <DialogContent>
        <DialogContentText>Details are as follows</DialogContentText>
        <TextField
          sx={{ mt: 2, mb: 2 }}
          label="Batch"
          value={editedData.batch}
          onChange={handleChange}
          name="batch"
          fullWidth
          disabled
        />
        <TextField
          label="Program"
          value={editedData.program}
          onChange={handleChange}
          name="program"
          fullWidth
          sx={{ mb: 2 }}
          disabled
        />
        <TextField
          label="Number of Students"
          value={editedData.noOfStudents}
          onChange={handleChange}
          name="noOfStudents"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Distributor"
          value={editedData.distributor}
          onChange={handleChange}
          name="distributor"
          fullWidth
          sx={{ mb: 2 }}
          disabled
        />
        <TextField
          label="Status"
          value={editedData.status}
          onChange={handleChange}
          name="status"
          fullWidth
          sx={{ mb: 2 }}
          disabled
        />
        <TextField
          label="Available Date"
          value={editedData.availableDate}
          onChange={handleChange}
          name="availableDate"
          fullWidth
          sx={{ mb: 2 }}
          disabled
        />
        <TextField
          label="Allotted Date"
          value={editedData.allottedDate}
          onChange={handleChange}
          name="allottedDate"
          fullWidth
          sx={{ mb: 2 }}
          disabled
        />
        <TextField
          label="Start Date"
          value={editedData.startDate}
          onChange={handleChange}
          name="startDate"
          fullWidth
          sx={{ mb: 2 }}
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={!isChanged}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModalDetails;
