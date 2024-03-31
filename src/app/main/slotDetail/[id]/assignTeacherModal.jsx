import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { getApprovedTeachers } from "@/services/cont-teacher.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ManualAssignInvigilatorService } from "@/services/controller.service";
import { enqueueSnackbar } from "notistack";

const AssignTeacherModal = ({ open, handleClose, roomId, room, slotId }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const queryClient = useQueryClient();

  const approvedTeacherResult = useQuery({
    queryKey: ["teachers", { type: "approved" }, controllerToken],
    queryFn: () => getApprovedTeachers(controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  const [filterValue, setFilterValue] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState([]);

  const filteredOptions = approvedTeacherResult.data
    ? approvedTeacherResult.data.filter(
        (teacher) =>
          `${teacher.name} ${teacher.sap_id}`
            .toLowerCase()
            .includes(filterValue.toLowerCase()) &&
          !selectedTeacherId.includes(teacher._id)
      )
    : [];

  const assignInvigilatorMutation = useMutation({
    mutationFn: (assignmentDetails) =>
      ManualAssignInvigilatorService(controllerToken, assignmentDetails),
    onSuccess: () => {
      queryClient.invalidateQueries("rooms");
      handleClose();
      enqueueSnackbar({
        variant: "success",
        message: "Invigilator assigned successfully",
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

  const handleSelect = async () => {
    if (selectedTeacher) {
      const { _id: invigilatorId } = selectedTeacher;
      setSelectedTeacherId([...selectedTeacherId, invigilatorId]);
      const assignmentDetails = {
        roomId: roomId,
        slotId: slotId,
        invigilatorId: invigilatorId,
      };
      assignInvigilatorMutation.mutate(assignmentDetails);
      setSelectedTeacher(null);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ width: 400 }}>
        <Typography variant="h5">Room Details</Typography>{" "}
        {room ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box my={1} alignItems="center">
                <Typography color="primary">Room Number</Typography>
                <Typography variant="h5">{room.room_no}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box mb={1} alignItems="center">
                <Typography color="primary">Block</Typography>
                <Typography variant="h5">{room.block}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box mb={1} alignItems="center">
                <Typography color="primary">Floor</Typography>
                <Typography variant="h5">{room.floor}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box mb={1} alignItems="center">
                <Typography color="primary">No. of Students</Typography>
                <Typography variant="h5">{room.students}</Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography>No room details available.</Typography>
        )}
        <Box mt={1}>
          <Typography color="primary">Assign Invigilator</Typography>
          <Autocomplete
            options={filteredOptions}
            getOptionLabel={(option) => `${option.name}  ${option.sap_id}`}
            onChange={(event, value) => {
              setSelectedTeacher(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search Teachers"
                onChange={(event) => setFilterValue(event.target.value)}
              />
            )}
            popperPlacement="bottom-start"
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
            onClick={handleSelect}
            disabled={!selectedTeacher || assignInvigilatorMutation.isLoading}
          >
            {assignInvigilatorMutation.isLoading ? "Assigning..." : "Select"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTeacherModal;
