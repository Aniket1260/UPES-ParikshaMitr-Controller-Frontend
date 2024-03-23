import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

const DetailsModal = ({ isOpen, onClose, selectedRow }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Details</DialogTitle>
      <DialogContent>
        {selectedRow && (
          <>
            <Box
              sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}
            >
              <Typography color="primary" variant="body1">
                Name
              </Typography>
              <Typography variant="h6">
                {selectedRow.teacher_id.name}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography color="primary" variant="body1">
                  SAP ID
                </Typography>
                <Typography variant="h6">
                  {selectedRow.teacher_id.sap_id}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography color="primary" variant="body1">
                  Phone
                </Typography>
                <Typography variant="h6">
                  {selectedRow.teacher_id.phone}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ marginTop: 2 }}>
              <Typography color="primary" variant="body1">
                Room Details
              </Typography>
              {selectedRow.rooms_assigned.map((room) => (
                <Accordion key={room}>
                  <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography variant="subtitle1" mr={1}>
                      {room.room_id?.room_no}
                    </Typography>{" "}
                    <Chip
                      label={room.status}
                      color={
                        room.status === "approved"
                          ? "success"
                          : room.status === "requested"
                          ? "warning"
                          : "default"
                      }
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {room.room_remarks ? room.room_remarks : "No remarks yet"}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsModal;
