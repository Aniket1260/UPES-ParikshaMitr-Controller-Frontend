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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ManualAssignInvigilatorService } from "@/services/controller.service";
import { enqueueSnackbar } from "notistack";
import { refetchInterval } from "@/config/var.config";
import { GetInvigilatorsInSlotService } from "@/services/exam-slots.service";

const AssignTeacherModal = ({
  open,
  handleClose,
  roomId,
  room,
  slotId,
  assignedTeachersIdList,
}) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const queryClient = useQueryClient();

  const approvedTeacherResult = useQuery({
    queryKey: ["teachers", { type: "approved" }, controllerToken, slotId],
    queryFn: () => GetInvigilatorsInSlotService(controllerToken, slotId),
    retry: 2,
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
  });

  const [filterValue, setFilterValue] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState([]);

  const filteredOptions = approvedTeacherResult.data?.data
    ? approvedTeacherResult.data?.data?.filter(
        (teacher) => !assignedTeachersIdList.includes(teacher._id)
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
        message: error.response?.status + " : " + error.response?.data.message,
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
