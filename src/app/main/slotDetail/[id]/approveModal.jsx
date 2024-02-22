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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { approveRoom, getRoomDetailsById } from "@/services/exam-slots.service";
import { enqueueSnackbar } from "notistack";

const ApproveModal = ({ open, handleClose, room }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["roomDetails", controllerToken, room?.room_id],
    queryFn: () => getRoomDetailsById(controllerToken, room?.room_id),
    enabled: !!room?.room_id,
  });

  const mutation = useMutation({
    mutationFn: () => approveRoom(room?.room_id, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Room Approved Successfully",
      });
      queryClient.invalidateQueries("slotDetails");
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.message,
      });
    },
  });

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Approve Submission</DialogTitle>
      <DialogContent>
        <div>
          room_id: {room?.room_id} - {room?.room_name}
        </div>
        <div>
          Please verify that you have received following from invigilator
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
              {data && (
                <>
                  <TableRow>
                    <TableCell style={{ flex: 1, fontWeight: "bold" }}>
                      Type
                    </TableCell>
                    <TableCell style={{ flex: 0.5, fontWeight: "bold" }}>
                      Quantity
                    </TableCell>
                  </TableRow>
                  {data.data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ flex: 1 }}>{item.type}</TableCell>
                      <TableCell style={{ flex: 0.5 }}>
                        {item.quantity + " " + "Nos."}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={mutation.mutate}>
            Approve
          </Button>
          <Button variant="contained" color="primary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveModal;
