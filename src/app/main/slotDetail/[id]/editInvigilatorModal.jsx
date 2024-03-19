import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";

const EditInvigilatorModal = ({
  room,
  isOpen,
  onClose,
  invigilators_assigned,
  roomId,
}) => {
  const [invigilators, setInvigilators] = useState(invigilators_assigned);

  useEffect(() => {
    setInvigilators(invigilators_assigned);
  }, [invigilators_assigned]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    const invigilatorUpdated = {
      room_id: roomId,
      num_inv: invigilators,
    };
    console.log(invigilatorUpdated);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogContent sx={{ width: 400 }}>
        <Typography variant="h5" color="primary">
          Room {room?.room_no}
        </Typography>
        <Typography variant="h6" mt="2">
          Assigned Invigilators {invigilators}
        </Typography>

        <Box mt={3}>
          <TextField
            label="Number of Invigilators"
            variant="outlined"
            type="number"
            value={invigilators}
            InputProps={{
              inputProps: { min: 0, max: 3 }, //min is 0, bcz I'm taking invigilator count as per assignment, so if no invigilator is assigned then it would show 0
              style: { textAlign: "center" },
              onKeyDown: (e) => e.preventDefault(),
            }}
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              if (!isNaN(newValue) && newValue >= 0 && newValue <= 3) {
                setInvigilators(newValue);
              }
            }}
            fullWidth
          />
        </Box>
        <Box mt={3} textAlign="right">
          <Button
            variant="outlined"
            onClick={handleClose}
            style={{ marginRight: "8px" }}
          >
            Close
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvigilatorModal;
