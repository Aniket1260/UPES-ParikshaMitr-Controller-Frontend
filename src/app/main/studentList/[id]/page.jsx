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
  IconButton,
  MenuItem,
  Select,
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
      console.log(updatedStudent);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating eligibility:", error);
    }
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
      console.log(StudentListQuery.data);
      return StudentListQuery.data;
    }
    return [];
  }, [StudentListQuery.isSuccess, StudentListQuery.data]);

  return (
    <Box>
      <Typography variant="h4">Student List</Typography>
      <Box sx={{ mt: 2 }}>
        {StudentListQuery.isLoading && <CircularProgress />}

        {StudentListQuery.isSuccess && rows.length > 0 && (
          <>
            {/* <Box>
              <Text
            </Box> */}
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
              sx={{ width: "100%" }}
            />
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
