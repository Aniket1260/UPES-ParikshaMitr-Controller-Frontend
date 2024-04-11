import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getFreeTeachersBySlotID } from "@/services/flying.service";

const AddFlyingModal = ({ isOpen, onClose, slotId }) => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const SlotGetQuery = useQuery({
    queryKey: ["freeTeachers", slotId, controllerToken],
    queryFn: () => getFreeTeachersBySlotID(controllerToken, slotId),
    enabled: isOpen,
  });

  const handleAddFlying = () => {
    const flyingData = {
      slot_id: slotId,
      teacher_id: selectedTeacher._id,
    };
    console.log(flyingData);
    onClose();
  };

  const options =
    SlotGetQuery.data && Array.isArray(SlotGetQuery.data.data)
      ? SlotGetQuery.data.data.map((teacher) => ({
          name: teacher.name,
          sap: teacher.sap_id,
          _id: teacher._id,
        }))
      : [];

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add New Flying</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: 400, mt: 1 }}>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => `${option.name} ${option.sap}`}
            onChange={(event, value) => setSelectedTeacher(value)}
            renderInput={(params) => (
              <TextField {...params} label="Select Teacher" />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddFlying} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFlyingModal;
