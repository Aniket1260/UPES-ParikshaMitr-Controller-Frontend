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
import { useMutation } from "@tanstack/react-query";
import { uploadBundleService } from "@/services/copy-distribution";
import { enqueueSnackbar } from "notistack";

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
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const [csvData, setCsvData] = useState(null);
  const [valState, setValState] = useState({
    text: "",
    enabled: false,
  });
  const [progress, setProgress] = useState({
    loading: false,
    bundles_uploaded: 0,
  });

  useEffect(() => {
    if (valState.text.trim() === "uploadcopydistribution") {
      setValState((prev) => ({ ...prev, enabled: true }));
    } else {
      setValState((prev) => ({ ...prev, enabled: false }));
    }
  }, [valState.text]);

  const UploadBundleMutation = useMutation({
    mutationFn: (data) => uploadBundleService(controllerToken, data),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar({
        message:
          "Error Uploading Bundle No " +
          (progress.bundles_uploaded + 1) +
          ": " +
          error.response?.data.message,
        variant: "error",
        autoHideDuration: 10000,
      });
    },
  });

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

  const handleUpload = async () => {
    setProgress({ loading: true, bundles_uploaded: 0 });
    const response = {
      data: csvData,
    };
    console.log(response);
    for (const bundle of response.data) {
      try {
        await UploadBundleMutation.mutateAsync(bundle);
      } catch (e) {
        console.error(e);
      }
      setProgress((prev) => ({
        ...prev,
        bundles_uploaded: prev.bundles_uploaded + 1,
      }));
    }
    enqueueSnackbar({
      message: "All Bundles Uploaded",
      variant: "success",
    });
    setProgress({ loading: false, bundles_uploaded: 0 });
    handleClose();
  };

  const handleClose = () => {
    setCsvData(null);
    setValState({ text: "", enabled: false });
    onClose();
  };

  const cols = [
    { field: "subjectName", headerName: "Subject Name", minWidth: 150 },
    { field: "subjectCode", headerName: "Subject Code", minWidth: 150 },
    { field: "evaluationMode", headerName: "Evaluation Mode", minWidth: 150 },
    { field: "program", headerName: "Program", minWidth: 150 },
    { field: "batch", headerName: "Batch", minWidth: 150 },
    { field: "noOfStudents", headerName: "Number of Students", minWidth: 150 },
    { field: "evaluatorName", headerName: "Evaluator Name", minWidth: 150 },
    { field: "evaluatorSap", headerName: "Evaluator's SAPID", minWidth: 150 },
    { field: "evaluatorSchool", headerName: "Evaluator School", minWidth: 150 },
    { field: "dateOfExam", headerName: "Date of Exam", minWidth: 150 },
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
            {progress.loading && (
              <Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Uploading Bundles
                </Typography>
                <Typography>
                  {progress.bundles_uploaded} of {csvData.length} Bundles
                  Uploaded
                </Typography>
              </Box>
            )}
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
                onClick={() => handleUpload()}
                disabled={!valState.enabled || progress.loading}
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
