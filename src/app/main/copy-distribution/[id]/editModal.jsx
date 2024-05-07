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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editBatchService } from "../../../../services/copy-distribution";
import { enqueueSnackbar } from "notistack";

const EditModalDetails = ({ rowData, open, onClose }) => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

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
        id: rowData.id,
      }));
    }
  }, [rowData]);

  const queryClient = useQueryClient();

  const { mutate: editDataMutation } = useMutation({
    mutationFn: () =>
      editBatchService(
        {
          ...editedData,
          numStudents: +editedData.noOfStudents,
        },
        controllerToken
      ),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Bundle Edited Successfully",
      });
      queryClient.invalidateQueries("bundle");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
    onSettled: () => {
      setEditedData({
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
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    editDataMutation();
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
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModalDetails;
