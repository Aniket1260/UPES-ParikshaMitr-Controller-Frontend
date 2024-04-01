import { AddStudentService } from "@/services/exam-slots.service";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { useState } from "react";

const AddStudentDialog = ({ open, onClose, room_id }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }
  const [newStudentData, setNewStudentData] = useState({
    roll_no: "",
    student_name: "",
    course: "",
    subject: "",
    subject_code: "",
    sap_id: "",
    seat_no: "",
    eligible: "YES",
  });
  const queryClient = useQueryClient();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewStudentData((prevData) => ({ ...prevData, [name]: value }));
  };
  const addStudentMutation = useMutation({
    mutationFn: (newstudentData) =>
      AddStudentService(controllerToken, newstudentData),
    onSuccess: () => {
      queryClient.invalidateQueries(["studentList", controllerToken, room_id]);
      setNewStudentData({
        roll_no: "",
        student_name: "",
        course: "",
        subject: "",
        subject_code: "",
        sap_id: "",
        seat_no: "",
        eligible: "YES",
      });
      onClose();
      enqueueSnackbar({
        variant: "success",
        message: "Student added successfully",
      });
    },
    onError: (error) => {
      console.log("error", error);
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  const handleAddStudent = () => {
    const student = {
      ...newStudentData,
      sap_id: Number(newStudentData.sap_id),
    };
    const newStudentWithNumberId = {
      room_id,
      student,
    };
    console.log(newStudentWithNumberId);
    addStudentMutation.mutate(newStudentWithNumberId);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Student</DialogTitle>
      <DialogContent>
        <TextField
          label="Sap id"
          name="sap_id"
          value={newStudentData.sap_id}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Roll No"
          name="roll_no"
          value={newStudentData.roll_no}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Student Name"
          name="student_name"
          value={newStudentData.student_name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Course"
          name="course"
          value={newStudentData.course}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Subject"
          name="subject"
          value={newStudentData.subject}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Subject Code"
          name="subject_code"
          value={newStudentData.subject_code}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Seat No"
          name="seat_no"
          value={newStudentData.seat_no}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <Select
            labelId="eligible"
            id="eligible"
            value={newStudentData.eligible}
            onChange={(event) =>
              setNewStudentData((prevData) => ({
                ...prevData,
                eligible: event.target.value,
              }))
            }
          >
            <MenuItem value="YES">ELIGIBLE</MenuItem>
            <MenuItem value="F_HOLD">FINANCIAL HOLD</MenuItem>
            <MenuItem value="DEBARRED">DEBARRED</MenuItem>
            <MenuItem value="R_HOLD">REGISTRATION HOLD</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddStudent} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddStudentDialog;
