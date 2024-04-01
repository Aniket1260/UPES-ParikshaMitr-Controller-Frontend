import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { UploadDutyService } from "@/services/exam-slots.service";

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

const UploadDutyPlan = ({ open, handleClose, slot }) => {
  const [csvData, setCsvData] = useState(null);
  const [valState, setValState] = useState({
    text: "",
    enabled: false,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (valState.text.trim() === "uploaddutyplan") {
      setValState((prev) => ({ ...prev, enabled: true }));
    } else {
      setValState((prev) => ({ ...prev, enabled: false }));
    }
  }, [valState.text]);

  const { mutateAsync: uploadDutyPlan } = useMutation({
    mutationFn: (data) => UploadDutyService(controllerToken, data),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Duty Plan Uploaded Successfully",
      });
      queryClient.invalidateQueries("slots");
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message:
          error.response?.status + " : " + error.response?.data.message ||
          "An error occurred",
      });
    },
  });

  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      let data = e.target.result;
      const rows = data.split("\n");
      const headers = rows[0].split(","); // extracting headers
      const sapIndex = headers.findIndex(
        // finding index of SAP_ID and other headers
        (header) => header.trim() === "SAP_ID"
      );
      const dutyIndex = headers.findIndex((header) => header.trim() === "Duty");
      data = rows.slice(1).filter((row) => row.trim() !== ""); // removing empty rows-> just a check
      // console.log("Data:", data);

      // creating object with sap and duty as keys and their values as values
      const parsedData = data.map((row) => {
        const rowData = row.trim().split(",");
        const sap = rowData[sapIndex];
        const duty = dutyIndex !== -1 ? rowData[dutyIndex] : "";
        return { sap, duty };
      });
      // console.log("Parsed Data:", parsedData);
      setCsvData(parsedData);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!csvData) return;

    try {
      const flySapIds = [];
      const invSapIds = [];
      csvData.forEach(({ sap, duty }) => {
        const sapId = parseInt(sap);
        if (duty === "FS") {
          flySapIds.push(sapId);
        } else if (duty === "INV") {
          invSapIds.push(sapId);
        }
      });

      if (flySapIds.length < 1 || invSapIds.length < 1) {
        throw new Error("At least one SAP ID is required for each duty type");
      }

      const response = {
        slot_id: slot._id,
        fly_sap_ids: flySapIds,
        inv_sap_ids: invSapIds,
      };

      await uploadDutyPlan(response);

      enqueueSnackbar({
        variant: "success",
        message: "Duty Plan Uploaded Successfully",
      });

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const cols = [
    { field: "sap", headerName: "SAP ID", flex: 1 },
    { field: "duty", headerName: "Duty", flex: 1 },
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
      <DialogTitle>Upload Duty Plan</DialogTitle>
      <DialogContent>
        <DialogContentText>Upload Duty Plan CSV</DialogContentText>
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
              Duty Plan Preview
            </Typography>
            <div style={{ height: 400, width: "100%", marginTop: 10 }}>
              <DataGrid
                rows={csvData}
                columns={cols}
                getRowId={(row) => row.sap}
                pageSizeOptions={[5]}
              />
            </div>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Please enter &apos;<b>uploaddutyplan</b>&apos; to Continue
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
                onClick={handleSubmit}
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

export default UploadDutyPlan;
