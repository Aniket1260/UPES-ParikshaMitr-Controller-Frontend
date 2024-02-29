import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingSupplies } from "@/services/exam-slots.service";

const PendingSuppliesModal = ({ open, handleClose, room }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["roomDetails", controllerToken, room?.room_id],
    queryFn: () => getPendingSupplies(controllerToken, room?.room_id),
    enabled: !!room?.room_id,
  });

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Pending Supplies (Room No. {room?.room_no})</DialogTitle>
      <DialogContent>
        <div>
          These are the pending supplies for the room. Please send the supplies
          as soon as possible.
        </div>
        <br></br>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell>Loading...</TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell>Error fetching data</TableCell>
                </TableRow>
              )}
              {data && data.pending_supplies && (
                <>
                  <TableRow>
                    <TableCell style={{ flex: 1, fontWeight: "bold" }}>
                      Type
                    </TableCell>
                    <TableCell style={{ flex: 0.5, fontWeight: "bold" }}>
                      Quantity
                    </TableCell>
                  </TableRow>
                  {data.pending_supplies
                    .filter((item) => item.quantity > 0)
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ flex: 1 }}>
                          {item.suppl_type}
                        </TableCell>
                        <TableCell style={{ flex: 0.5 }}>
                          {item.quantity + " Nos."}
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "end", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCancel}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PendingSuppliesModal;
