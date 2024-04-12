import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const ManualEntryModal = ({ open, onClose, columns }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e, field) => {
    let value = e.target.value;

    if (field === "sap") {
      setFormData({
        ...formData,
        [field]: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSubmit = () => {
    console.log(formData);
    setFormData({});
    onClose();
  };

  const handleCancel = () => {
    setFormData({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth>
      <DialogTitle>Manual Entry</DialogTitle>
      <DialogContent dividers>
        {columns.map((column) => (
          <Box key={column.field} mb={2}>
            {column.field !== "actions" && (
              <TextField
                label={column.headerName}
                fullWidth
                value={formData[column.field] || ""}
                onChange={(e) => handleChange(e, column.field)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Box>
        ))}
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
