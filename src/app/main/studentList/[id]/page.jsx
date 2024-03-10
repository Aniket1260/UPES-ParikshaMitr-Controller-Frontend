"use client";
import {
  getStudentListByRoomId,
  UpdateStudentEligibility,
} from "@/services/exam-slots.service";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Tooltip from "@mui/material/Tooltip";

const StudentListRoomID = ({ params }) => {
  const { id: roomId } = params;
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const StudentListQuery = useQuery({
    queryKey: ["studentList", controllerToken, roomId],
    queryFn: () => getStudentListByRoomId(controllerToken, roomId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
  });

  if (StudentListQuery.isError) {
    enqueueSnackbar("Error fetching student list", { variant: "error" });
  }

  const [openModal, setOpenModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionDisplay, setSelectedOptionDisplay] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const queryClient = useQueryClient();
  const updateEligibilityMutation = useMutation({
    mutationFn: (updatedStudent) =>
      UpdateStudentEligibility(controllerToken, updatedStudent),

    onSuccess: () => {
      enqueueSnackbar("Eligibility updated successfully", {
        variant: "success",
      });

      queryClient.invalidateQueries(["studentList", controllerToken, roomId]);
    },
    onError: (error) => {
      console.error("Error updating eligibility:", error);
    },
  });

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setSelectedOption(student.eligible);
    setSelectedOptionDisplay("");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedOptionDisplay(event.target.value);
  };

  const handleUpdateEligibility = async () => {
    try {
      const updatedStudent = {
        room_id: roomId,
        sap_id: selectedStudent.sap_id,
        eligible: selectedOption,
      };
      await updateEligibilityMutation.mutateAsync(updatedStudent);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating eligibility:", error);
    }
  };

  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);

  const handleOpenAddStudentModal = () => {
    setAddStudentModalOpen(true);
  };

  const handleCloseAddStudentModal = () => {
    setAddStudentModalOpen(false);
  };

  const handleAddStudent = (newStudentData) => {
    console.log(newStudentData);
    handleCloseAddStudentModal();
  };
  const cols = [
    { field: "sap_id", headerName: "SAP ID", width: 150 },
    { field: "roll_no", headerName: "Roll No.", width: 150 },
    { field: "student_name", headerName: "Name", width: 150 },
    { field: "seat_no", headerName: "Seat No", width: 120 },
    { field: "subject", headerName: "Subject", width: 150 },
    { field: "subject_code", headerName: "Subject Code", width: 150 },
    {
      field: "attendance",
      headerName: "Attendance",
      width: 120,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor: params.value ? "darkgreen" : "#ad1313",
              color: "white",
              padding: "5px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Typography variant="body1" py={1}>
              {params.value ? "P" : "A"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "eligible",
      headerName: "Eligible",
      width: 150,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              backgroundColor:
                params.value === "YES"
                  ? "darkgreen"
                  : params.value === "F_HOLD"
                  ? "#EAAA08"
                  : params.value === "DEBARRED"
                  ? "#ad1313"
                  : "#E508EA",
              color: "white",
              padding: "5px",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Typography variant="body1" py={1}>
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <Tooltip title="Edit students eligibility" arrow placement="top">
            <IconButton onClick={() => handleOpenModal(params.row)}>
              <CheckCircleOutlineIcon color="primary" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const rows = useMemo(() => {
    if (StudentListQuery.isSuccess) {
      return StudentListQuery.data;
    }
    return [];
  }, [StudentListQuery.isSuccess, StudentListQuery.data]);

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Student List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddStudentModal}
        >
          Add Student
        </Button>
      </Grid>
      <Dialog
        open={addStudentModalOpen}
        onClose={() => setAddStudentModalOpen(false)}
      ></Dialog>
      <AddStudentDialog
        open={addStudentModalOpen}
        onClose={handleCloseAddStudentModal}
        onAddStudent={handleAddStudent}
      />
      <Box sx={{ mt: 2, maxWidth: "80vw" }}>
        {StudentListQuery.isLoading && <CircularProgress />}

        {StudentListQuery.isSuccess && rows.length > 0 && (
          <>
            {/* <Box>
              <Text
            </Box> */}
            {/* <Box sx={{ maxWidth: "100%", overflowX: "scroll" }}> */}
            <DataGrid
              rows={rows}
              columns={cols}
              disableRowSelectionOnClick
              disableColumnSelector
              getRowId={(row) => row?.sap_id}
              slots={{
                toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarFilterButton />
                  </GridToolbarContainer>
                ),
              }}
              // sx={{ overflowX: "scroll", maxWidth: "100%" }}
              // sx={{ width: "100%" }}
            />
            {/* </Box> */}
          </>
        )}
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Student Eligibility</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              <Typography variant="subtitle2" color="primary">
                <b>Sap_id:</b>
              </Typography>
              <Typography variant="subtitle1">
                {selectedStudent.sap_id}
              </Typography>

              <Typography variant="subtitle2" color="primary">
                <b>Roll_No:</b>
              </Typography>
              <Typography variant="subtitle1">
                {selectedStudent.roll_no}
              </Typography>

              <Typography variant="subtitle2" color="primary">
                <b>Name:</b>
              </Typography>
              <Typography variant="subtitle1">
                {selectedStudent.student_name}
              </Typography>

              <Typography variant="subtitle2" color="primary">
                <b>Course:</b>
              </Typography>
              <Typography variant="subtitle1">
                {selectedStudent.course}
              </Typography>

              <Typography variant="subtitle2" color="primary">
                <b>Subject:</b>
              </Typography>
              <Typography variant="subtitle1">
                {selectedStudent.subject}
              </Typography>

              <Typography variant="subtitle2" color="primary">
                <b>Subject Code:</b>
              </Typography>
              <Typography variant="subtitle1">
                {selectedStudent.subject_code}
              </Typography>

              <Typography variant="subtitle1" color="primary">
                <b>Eligible:</b>
              </Typography>
              <Select
                value={selectedOption || selectedStudent.eligible}
                onChange={handleOptionChange}
                label="Eligibility"
                fullWidth
              >
                <MenuItem value="YES">ELIGIBLE</MenuItem>
                <MenuItem value="F_HOLD">FINANCIAL HOLD</MenuItem>
                <MenuItem value="DEBARRED">DEBARRED</MenuItem>
                <MenuItem value="R_HOLD">REGISTRATION HOLD</MenuItem>
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleUpdateEligibility} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentListRoomID;

const AddStudentDialog = ({ open, onClose, onAddStudent }) => {
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewStudentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddStudent = () => {
    const newStudentWithNumberId = {
      ...newStudentData,
      sap_id: Number(newStudentData.sap_id),
    };
    onAddStudent(newStudentWithNumberId);

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
