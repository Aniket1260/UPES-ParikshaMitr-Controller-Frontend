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
import { enqueueSnackbar } from "notistack";
import { editBundleService } from "../../../services/copy-distribution";

const EditModal = ({ rowData, open, onClose }) => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const [editedData, setEditedData] = useState({
    evaluatorName: rowData ? rowData.evaluatorName : "",
    sap: rowData ? rowData.sap : "",
    dateOfExamination: "",
    subjectName: "",
    roomNumber: "",
    evaluationMode: rowData ? rowData.evaluationMode : "",
    subjectCode: rowData ? rowData.subjectCode : "",
    subjectSchool: rowData ? rowData.subjectSchool : "",
    status: rowData ? rowData.status : "",
    id: rowData ? rowData._id : "",
  });
  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    if (rowData) {
      setEditedData((prevData) => ({
        ...prevData,
        dateOfExamination: rowData.dateofexam,
        subjectName: rowData.subjectName,
        roomNumber: rowData.roomNo,
        status: rowData.status,
        subjectCode: rowData.subjectCode,
        subjectSchool: rowData.subjectSchool,
        evaluationMode: rowData.evaluationMode,
        sap: rowData.sap,
        evaluatorName: rowData.evaluatorName,
        id: rowData._id,
      }));
    }
  }, [rowData]);

  const queryClient = useQueryClient();

  const { mutate: editDataMutation } = useMutation({
    mutationFn: () =>
      editBundleService(
        {
          ...editedData,
          roomNumber: +editedData.roomNumber,
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
        evaluatorName: rowData ? rowData.evaluatorName : "",
        sap: rowData ? rowData.sap : "",
        dateOfExamination: "",
        subjectName: "",
        roomNumber: "",
        evaluationMode: rowData ? rowData.evaluationMode : "",
        subjectCode: rowData ? rowData.subjectCode : "",
        subjectSchool: rowData ? rowData.subjectSchool : "",
        status: rowData ? rowData.status : "",
        id: rowData ? rowData._id : "",
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
          label="Evaluator Name"
          value={editedData.evaluatorName}
          onChange={handleChange}
          name="evaluatorName"
          fullWidth
          disabled
        />
        <TextField
          sx={{ mb: 2 }}
          label="SAP"
          value={editedData.sap}
          onChange={handleChange}
          name="sap"
          fullWidth
          disabled
        />
        <TextField
          sx={{ mb: 2 }}
          label="Date Of Examination"
          value={editedData.dateOfExamination}
          onChange={handleChange}
          name="dateOfExamination"
          fullWidth
        />
        <TextField
          sx={{ mb: 2 }}
          label="Subject Name"
          value={editedData.subjectName}
          onChange={handleChange}
          name="subjectName"
          fullWidth
        />
        <TextField
          sx={{ mb: 2 }}
          label="Room Number"
          value={editedData.roomNumber}
          onChange={handleChange}
          name="roomNumber"
          fullWidth
        />
        <TextField
          sx={{ mb: 2 }}
          label="Evaluation Mode"
          value={editedData.evaluationMode}
          onChange={handleChange}
          name="evaluationMode"
          fullWidth
          disabled
        />
        <TextField
          sx={{ mb: 2 }}
          label="Subject Code"
          value={editedData.subjectCode}
          onChange={handleChange}
          name="subjectCode"
          fullWidth
          disabled
        />
        <TextField
          sx={{ mb: 2 }}
          label="Subject School"
          value={editedData.subjectSchool}
          onChange={handleChange}
          name="subjectSchool"
          fullWidth
          disabled
        />
        <TextField
          label="Status"
          value={editedData.status}
          onChange={handleChange}
          name="status"
          fullWidth
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
          // disabled={!isChanged}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
