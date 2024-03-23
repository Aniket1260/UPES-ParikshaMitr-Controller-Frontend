import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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
              <Typography variant="body1">
                {selectedRow.teacher_id.name}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography color="primary" variant="body1">
                  SAP ID
                </Typography>
                <Typography variant="body1">
                  {selectedRow.teacher_id.sap_id}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography color="primary" variant="body1">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {selectedRow.teacher_id.phone}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ marginTop: 2 }}>
              <Typography variant="subtitle1">Room Details</Typography>
              <List>
                {selectedRow.rooms_assigned.map((room) => (
                  <ListItem key={room._id}>
                    <ListItemText
                      primary={`Room No: ${room.room_no}`}
                      secondary={`Remark: ${room.remark}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Accordion>
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="subtitle1">Remarks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  {selectedRow.final_remarks
                    ? selectedRow.final_remarks
                    : "No remarks yet"}
                </Typography>
              </AccordionDetails>
            </Accordion>
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
