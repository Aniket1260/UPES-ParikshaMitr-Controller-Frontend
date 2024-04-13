import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { uploadBundleService } from "@/services/copy-distribution";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import format from "date-fns/format";

const ManualEntryModal = ({ open, onClose }) => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }
  const queryClient = useQueryClient();
  const [manualBundleLoading, setManualBundleLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    evaluationMode: "",
    program: "",
    batch: "",
    noOfStudents: "",
    evaluatorName: "",
    evaluatorSap: "",
    evaluatorSchool: "",
    dateOfExam: "",
  });

  const ManualEntryMutation = useMutation({
    mutationFn: async (data) => {
      const results = await uploadBundleService(controllerToken, data);
      queryClient.invalidateQueries("bundles");
      return results;
    },
    onMutate: () => {
      setManualBundleLoading(true);
    },
    onSettled: () => {
      setManualBundleLoading(false);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar({
        message: "Error Uploading Bundle No " + error.response?.data.message,
        variant: "error",
        autoHideDuration: 10000,
      });
    },
  });

  const handleSubmit = async () => {
    const formattedDate = format(formData.dateOfExam, "dd/MM/yyyy");

    const formDataWithFormattedDate = {
      ...formData,
      dateOfExam: formattedDate,
    };
    console.log(formDataWithFormattedDate);
    await ManualEntryMutation.mutateAsync(formDataWithFormattedDate);
    enqueueSnackbar({
      message: "Manual Bundles Uploaded",
      variant: "success",
    });
    handleCancel();
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleCancel = () => {
    setFormData({
      subjectName: "",
      subjectCode: "",
      evaluationMode: "",
      program: "",
      batch: "",
      noOfStudents: "",
      evaluatorName: "",
      evaluatorSap: "",
      evaluatorSchool: "",
      dateOfExam: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth>
      <DialogTitle>Manual Entry</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <TextField
            label="Subject Name"
            fullWidth
            value={formData.subjectName}
            onChange={(e) => handleChange(e, "subjectName")}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Subject Code"
            fullWidth
            value={formData.subjectCode}
            onChange={(e) => handleChange(e, "subjectCode")}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Evaluation Mode"
            fullWidth
            value={formData.evaluationMode}
            onChange={(e) => handleChange(e, "evaluationMode")}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Program"
            fullWidth
            value={formData.program}
            onChange={(e) => handleChange(e, "program")}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Batch"
            fullWidth
            value={formData.batch}
            onChange={(e) => handleChange(e, "batch")}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Number of Students"
            fullWidth
            value={formData.noOfStudents}
            onChange={(e) => handleChange(e, "noOfStudents")}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Evaluator Name"
            fullWidth
            value={formData.evaluatorName}
            onChange={(e) => handleChange(e, "evaluatorName")}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Evaluator Sap"
            fullWidth
            value={formData.evaluatorSap}
            onChange={(e) => handleChange(e, "evaluatorSap")}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Evaluator School"
            fullWidth
            value={formData.evaluatorSchool}
            onChange={(e) => handleChange(e, "evaluatorSchool")}
          />
        </Box>
        <Box mb={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Exam"
              value={formData.dateOfExam}
              onChange={(newValue) =>
                setFormData({ ...formData, dateOfExam: newValue })
              }
              sx={{ m: 1 }}
              format="dd/MM/yyyy"
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </Box>
    </Dialog>
  );
};

export default ManualEntryModal;
