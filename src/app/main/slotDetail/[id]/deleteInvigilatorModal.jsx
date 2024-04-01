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
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInvigilatorService } from "@/services/cont-teacher.service";
import { enqueueSnackbar } from "notistack";

const DeleteInvigilatorModal = ({
  open,
  handleClose,
  roomId,
  room,
  slotId,
}) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const queryClient = useQueryClient();

  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const { mutate } = useMutation({
    mutationFn: (details) => deleteInvigilatorService(details, controllerToken),
    onSuccess: () => {
      queryClient.invalidateQueries("rooms");
      enqueueSnackbar({
        variant: "success",
        message: "Invigilator deleted successfully",
      });
      setSelectedTeacher(null);
      handleClose();
    },
    onError: (error) => {
      console.log("error", error);
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  const options = useMemo(() => {
    const a = [];
    if (room?.inv1) {
      a.push(room.inv1);
    }
    if (room?.inv2) {
      a.push(room.inv2);
    }
    if (room?.inv3) {
      a.push(room.inv3);
    }
    return a;
  }, [room]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ width: 400 }}>
        <Typography variant="h6">Do you want to delete invigilator?</Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box my={1} alignItems="center">
              <Typography color="primary">Room Number</Typography>
              <Typography variant="subtitle">{room?.room_no}</Typography>
            </Box>
          </Grid>
        </Grid>

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
            onClick={handleClose}
            style={{ marginRight: "8px" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              mutate({
                room_id: roomId,
                slot_id: slotId,
                invigilator_id: selectedTeacher._id,
              });
            }}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvigilatorModal;
