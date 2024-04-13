"use client";
import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  Grid,
  Autocomplete,
  TextField,
  Tab,
  Tabs,
} from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  GetInvigilatorsInSlotService,
  addInvDutytoSlotService,
  removeInvDutyfromSlotService,
} from "@/services/exam-slots.service";
import { getFreeTeachersBySlotID } from "@/services/flying.service";
import { enqueueSnackbar } from "notistack";

const ManageInvigilatorModal = ({ open, handleClose, slotId }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const InvInSlotQuery = useQuery({
    queryKey: ["invigilators", "slot", slotId, controllerToken],
    queryFn: () => GetInvigilatorsInSlotService(controllerToken, slotId),
    enabled: open,
  });

  const FreeTeachersQuery = useQuery({
    queryKey: ["freeTeachers", controllerToken, slotId],
    queryFn: () => getFreeTeachersBySlotID(controllerToken, slotId),
    enabled: open,
  });

  const AddInvigilatorMutation = useMutation({
    mutationFn: (data) => addInvDutytoSlotService(controllerToken, data),
    onSuccess: () => {
      queryClient.invalidateQueries("invigilators");
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.data.status + error.response?.data.message,
      });
    },
  });

  const RemoveInvigilatorMutation = useMutation({
    mutationFn: (data) => removeInvDutyfromSlotService(controllerToken, data),
    onSuccess: () => {
      queryClient.invalidateQueries("invigilators");
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.data.status + error.response?.data.message,
      });
    },
  });

  const queryClient = useQueryClient();

  const [selectedTab, setSelectedTab] = useState("add");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const options = useMemo(() => {
    if (selectedTab === "remove") {
      console.log("Invigilators in slot", InvInSlotQuery.data);
      return InvInSlotQuery.data?.data;
    } else {
      console.log("Free teachers", FreeTeachersQuery.data);
      return FreeTeachersQuery.data?.data;
    }
  }, [open, selectedTab, InvInSlotQuery.data, FreeTeachersQuery.data]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const closeDialog = () => {
    setSelectedTeacher(null);
    handleClose();
  };

  const handleAction = () => {
    if (selectedTab === "add") {
      AddInvigilatorMutation.mutate({
        slot_id: slotId,
        teacher_id: selectedTeacher._id,
      });
      console.log("Add invigilator", selectedTeacher);
      closeDialog();
    } else {
      RemoveInvigilatorMutation.mutate({
        slot_id: slotId,
        teacher_id: selectedTeacher._id,
      });
      console.log("Remove invigilator", selectedTeacher);
      closeDialog();
    }
  };

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogContent sx={{ width: 400 }}>
        <Typography variant="h6">Manage Invigilator Duties</Typography>

        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab value="add" label="Add" />
          <Tab value="remove" label="Remove" />
        </Tabs>

        <Box my={1} alignItems="center">
          <Autocomplete
            options={options}
            getOptionLabel={(option) => `${option.name}  ${option.sap_id}`}
            onChange={(event, value) => {
              setSelectedTeacher(value);
            }}
            value={selectedTeacher}
            renderInput={(params) => (
              <TextField {...params} placeholder="Search Teachers" />
            )}
          />
        </Box>

        <Box mt={3} textAlign="right">
          <Button
            variant="outlined"
            onClick={closeDialog}
            style={{ marginRight: "8px" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleAction}
            disabled={selectedTeacher === null}
          >
            {selectedTab === "add" ? "Add" : "Remove"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ManageInvigilatorModal;
