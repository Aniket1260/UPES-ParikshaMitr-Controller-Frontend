"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import styled from "@emotion/styled";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadBundleModal = ({ open, onClose }) => {
  const [csvData, setCsvData] = useState(null);
  const [valState, setValState] = useState({
    text: "",
    enabled: false,
  });

  useEffect(() => {
    if (valState.text.trim() === "uploadcopydistribution") {
      setValState((prev) => ({ ...prev, enabled: true }));
    } else {
      setValState((prev) => ({ ...prev, enabled: false }));
    }
  }, [valState.text]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      let data = e.target.result;
      const rows = data.split("\n");
      const headers = rows[0].split(",");
      const SubjectNameIndex = headers.findIndex(
        (header) =>
          header.trim().toLowerCase().replace(/_/g, " ") === "subject name"
      );
      const SubjectCodeIndex = headers.findIndex(
        (header) =>
          header.trim().toLowerCase().replace(/_/g, " ") === "subject code"
      );
      const EvaluationModeIndex = headers.findIndex(
        (header) =>
          header.trim().toLowerCase().replace(/_/g, " ") ===
          "evaluation mode(cont/theory/nontheory)"
      );
      const ProgramIndex = headers.findIndex(
        (header) => header.trim().toLowerCase() === "program/course"
      );
      const BatchIndex = headers.findIndex(
        (header) => header.trim().toLowerCase() === "batch"
      );
      const NoOfStudents = headers.findIndex(
        (header) =>
          header.trim().toLowerCase().replace(/_/g, " ") ===
          "number of students"
      );
      const EvaluatorNameIndex = headers.findIndex(
        (header) =>
          header.trim().toLowerCase().replace(/_/g, " ") === "evaluator name"
      );
      const EvaluatorSapIndex = headers.findIndex(
        (header) =>
          header.trim().toLowerCase().replace(/_/g, " ") === "evaluator's sapid"
      );
      const EvaluatorSchoolIndex = headers.findIndex(
        (header) =>
          header.trim().toLowerCase().replace(/_/g, " ") === "evaluator school"
      );
      const DateOfExamIndex = headers.findIndex(
        (header) =>
          header.trim().toLowerCase().replace(/_/g, " ") === "date of exam"
      );
      data = rows.slice(1).filter((row) => row.trim() !== "");

      const parsedData = data.map((row) => {
        const rowData = row.trim().split(",");
        const subjectName = rowData[SubjectNameIndex];
        const subjectCode = rowData[SubjectCodeIndex];
        const evaluationMode = rowData[EvaluationModeIndex];
        const program = rowData[ProgramIndex];
        const batch = rowData[BatchIndex];
        const noOfStudents = rowData[NoOfStudents];
        const evaluatorName = rowData[EvaluatorNameIndex];
        const evaluatorSap = rowData[EvaluatorSapIndex];
        const evaluatorSchool = rowData[EvaluatorSchoolIndex];
        const dateOfExam = rowData[DateOfExamIndex];
        return {
          subjectName,
          subjectCode,
          evaluationMode,
          program,
          batch,
          noOfStudents,
          evaluatorName,
          evaluatorSap,
          evaluatorSchool,
          dateOfExam,
        };
      });
      setCsvData(parsedData);
    };
    reader.readAsText(file);
  };

  const handleUpload = () => {
    const response = {
      data: csvData,
    };
    console.log(response);
    handleClose();
  };

  const handleClose = () => {
    setCsvData(null);
    setValState({ text: "", enabled: false });
    onClose();
  };

  const cols = [
    { field: "subjectName", headerName: "Subject Name", flex: 1 },
    { field: "subjectCode", headerName: "Subject Code", flex: 1 },
    { field: "evaluationMode", headerName: "Evaluation Mode", flex: 1 },
    { field: "program", headerName: "Program", flex: 1 },
    { field: "batch", headerName: "Batch", flex: 1 },
    { field: "noOfStudents", headerName: "Number of Students", flex: 1 },
    { field: "evaluatorName", headerName: "Evaluator Name", flex: 1 },
    { field: "evaluatorSap", headerName: "Evaluator's SAPID", flex: 1 },
    { field: "evaluatorSchool", headerName: "Evaluator School", flex: 1 },
    { field: "dateOfExam", headerName: "Date of Exam", flex: 1 },
    { field: "slotDate", headerName: "Slot Date", flex: 1 },
    { field: "slotTime", headerName: "Slot Time", flex: 1 },
  ];

  return (
    <Dialog
      open={open}
      onClose={() => {
        setCsvData(null);
        handleClose();
      }}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "1000px",
          },
        },
      }}
    >
      <DialogTitle>Upload CSV</DialogTitle>
      <DialogContent>
        <DialogContentText>Upload CSV File</DialogContentText>
        <Button
          variant="outlined"
          color="primary"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
          startIcon={<CloudUpload />}
        >
          Upload File
          <VisuallyHiddenInput
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </Button>

        {csvData?.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Uploaded CSV Preview
            </Typography>
            <div style={{ height: 400, width: "100%", marginTop: 10 }}>
              <DataGrid
                rows={csvData}
                columns={cols}
                getRowId={(row) => row.dateOfExam}
                pageSizeOptions={[5]}
              />
            </div>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Please enter &apos;<b>uploadcopydistribution</b>&apos; to Continue
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              label="Message"
              fullWidth
              value={valState.text}
              onChange={(e) => setValState({ text: e.target.value })}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  setCsvData(null);
                  handleClose();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!valState.enabled}
                sx={{ mt: 2 }}
              >
                Upload
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadBundleModal;
