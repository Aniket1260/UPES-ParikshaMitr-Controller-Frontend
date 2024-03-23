"use client";
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignRoomsToFlying,
  getRoomsForSlot,
} from "@/services/flying.service";
import { enqueueSnackbar } from "notistack";

const AssignRoomModal = ({
  isOpen,
  onClose,
  slotId,
  flyingId,
  name,
  rooms_assigned,
}) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const [rooms, setRooms] = React.useState([]);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRoomsForSlot(controllerToken, slotId);
        console.log(response.data, rooms_assigned);
        setRooms(
          response.data.map((item, index) => ({
            ...item,
            id: index,
            checked: rooms_assigned
              .map((room) => room?.room_id?._id)
              .includes(item._id),
          }))
        );
      } catch (error) {
        enqueueSnackbar({
          variant: "error",
          message: error.response?.data.message,
        });
      }
    };
    if (isOpen) fetchRooms();
  }, [controllerToken, slotId, isOpen, rooms_assigned]);

  const { mutate: AssignRooms } = useMutation({
    mutationFn: (roomIds) =>
      assignRoomsToFlying(controllerToken, flyingId, roomIds),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Rooms Assigned Successfully",
      });
      queryClient.invalidateQueries("flying");
      onClose();
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.data.message,
      });
    },
  });

  const GetUniqueBlocks = (rooms) => {
    return rooms.reduce((acc, curr) => {
      if (!acc.includes(curr.block)) {
        acc.push(curr.block);
      }
      return acc;
    }, []);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Rooms</DialogTitle>
      <DialogContent>
        Assign Rooms to {name}
        <Typography variant="body2" color="error" mt={1}>
          WARNING: Once assigned, rooms cannot be unassigned.
        </Typography>
        {rooms.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <FormGroup>
              {GetUniqueBlocks(rooms).map((block) => (
                <Accordion key={block}>
                  <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                    <Typography>{block}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container>
                      {rooms
                        .filter((room) => room.block === block)
                        .map((room) => (
                          <Grid item xs={12} md={6} key={room.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={room.checked}
                                  onChange={(e) => {
                                    setRooms((prev) =>
                                      prev.map((r) =>
                                        r.id === room.id
                                          ? { ...r, checked: e.target.checked }
                                          : r
                                      )
                                    );
                                  }}
                                  name={room.room_no}
                                />
                              }
                              label={room.room_no}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </FormGroup>
          </Box>
        ) : (
          <Typography>No Rooms Found</Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose}>Close</Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => {
              const selectedRooms = rooms.filter(
                (room) =>
                  room.checked &&
                  !rooms_assigned
                    .map((room) => room?.room_id?._id)
                    .includes(room._id)
              );
              if (selectedRooms.length === 0) {
                onClose();
                return;
              }
              AssignRooms(selectedRooms.map((room) => room._id));
            }}
          >
            Assign
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRoomModal;
