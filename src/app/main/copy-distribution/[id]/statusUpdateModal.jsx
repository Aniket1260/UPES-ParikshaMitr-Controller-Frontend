import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BundleSubmitUpdate,
  statusChangeService,
} from "@/services/copy-distribution";
import { enqueueSnackbar } from "notistack";

const StatusUpdateModal = ({
  open,
  onClose,
  onConfirm,
  status,
  batch,
  program,
  bundle_id,
  awardsheetHardcopyprop,
  awardsheetSoftcopyprop,
  answersheetprop,
}) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }
  const queryClient = useQueryClient();
  const [awardsheetSoftcopy, setAwardsheetSoftcopy] = useState(
    awardsheetSoftcopyprop
  );
  const [awardsheetHardcopy, setAwardsheetHardcopy] = useState(
    awardsheetHardcopyprop
  );
  const [answersheet, setAnswersheet] = useState(answersheetprop);

  const statusChangeMutation = useMutation({
    mutationFn: (statusData) =>
      statusChangeService(controllerToken, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries("bundle");
      handleClose();
      enqueueSnackbar({
        variant: "success",
        message: "Status changed successfully",
      });
    },
    onError: (error) => {
      console.log("error", error);
      enqueueSnackbar({
        variant: "error",
        message: error.message,
      });
    },
  });

  const bundleUpdateService = useMutation({
    mutationFn: (statusData) => BundleSubmitUpdate(controllerToken, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries("bundle");
      handleClose();
      enqueueSnackbar({
        variant: "success",
        message: "Updated successfully",
      });
    },
    onError: (error) => {
      console.log("error", error);
      enqueueSnackbar({
        variant: "error",
        message: error.message,
      });
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    switch (name) {
      case "awardsheetSoftcopy":
        setAwardsheetSoftcopy(checked);
        break;
      case "awardsheetHardcopy":
        setAwardsheetHardcopy(checked);
        break;
      case "answersheet":
        setAnswersheet(checked);
        break;
      default:
        break;
    }
  };

  const handleConfirm = async () => {
    let newStatus = status;

    if (status == "INPROGRESS" || status == "OVERDUE") {
      const data = {
        bundle_id: bundle_id,
        batch: batch,
        program: program,
        answersheet: answersheet,
        award_hardcopy: awardsheetHardcopy,
        award_softcopy: awardsheetSoftcopy,
      };
      bundleUpdateService.mutate(data);
      if (awardsheetSoftcopy && awardsheetHardcopy && answersheet) {
        const statusData = {
          bundle_id: bundle_id,
          batch: batch,
          program: program,
          status: "SUBMITTED",
        };
        statusChangeMutation.mutate(statusData);
      }
      handleClose();
    } else {
      const statusData = {
        bundle_id: bundle_id,
        batch: batch,
        program: program,
        status: newStatus,
      };
      statusChangeMutation.mutate(statusData);
      handleClose();
    }
  };

  let message = "";
  let action = "";

  switch (status) {
    case "AVAILABLE":
      message = "Request teacher to start the evaluation";
      action = "Started";
      break;
    case "INPROGRESS":
    case "OVERDUE":
      message = "Mark the status as submitted";
      action = "Submitted";
      break;
    default:
      return null;
  }
  const isUpdateDisabled =
    !awardsheetSoftcopy && !awardsheetHardcopy && !answersheet;

  if (status === "INPROGRESS" || status === "OVERDUE") {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Mark the items you have received</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={answersheet}
                onChange={handleCheckboxChange}
                name="answersheet"
                disabled={answersheetprop}
              />
            }
            label="Answersheet"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={awardsheetSoftcopy}
                onChange={handleCheckboxChange}
                name="awardsheetSoftcopy"
                disabled={awardsheetSoftcopyprop}
              />
            }
            label="Awardsheet Softcopy"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={awardsheetHardcopy}
                onChange={handleCheckboxChange}
                name="awardsheetHardcopy"
                disabled={awardsheetHardcopyprop}
              />
            }
            label="Awardsheet Hardcopy"
          />

          <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
            <Button color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={isUpdateDisabled}
            >
              Update
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <Box>
          <div>{message}</div>
          <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
            <Button color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
