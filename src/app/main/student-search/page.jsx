"use client";
import { StudentSearchService } from "@/services/controller.service";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

const StudentSearch = () => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  const StudentSearchMutation = useMutation({
    mutationFn: (query) => StudentSearchService(controllerToken, query),
    onSuccess: (data) => {
      console.log(data);
      setData(data?.data);
    },
    onError: (error) => {
      setData(null);
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
        autoHideDuration: 3000,
      });
    },
  });

  const handleSearch = async () => {
    if (!search) {
      enqueueSnackbar({
        variant: "error",
        message: "Please enter a valid search query",
        autoHideDuration: 3000,
      });
      return;
    }
    let s = "";
    if (search.startsWith("R")) {
      s = `roll_no=${search}`;
    } else {
      s = `sap_id=${search}`;
    }
    const result = await StudentSearchMutation.mutate(s);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Student Search
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Student ID"
            placeholder="Enter Student SAP ID or Roll No."
            variant="outlined"
            focused
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: "100%", fontSize: "1.1rem" }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Box>
        {StudentSearchMutation.isPending && <Typography>Loading...</Typography>}
        {data && (
          <Box sx={{ mt: 2 }}>
            <Grid container>
              <Grid item xs={12} sm={4} lg={2}>
                <Typography variant="body2" color="primary">
                  SAP ID:
                </Typography>
                <Typography variant="h5">{data.sap_id}</Typography>
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <Typography variant="body2" color="primary">
                  Roll No:
                </Typography>
                <Typography variant="h5">{data.roll_no}</Typography>
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <Typography variant="body2" color="primary">
                  Name:
                </Typography>
                <Typography variant="h5">{data.name}</Typography>
              </Grid>
            </Grid>
            <Typography variant="h6" sx={{ mt: 3 }}>
              Assigned Rooms
            </Typography>
            {data.rooms.length > 0 &&
              data.rooms.map((room, idx) => (
                <RoomCard key={`room-${idx}`} room={room} />
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StudentSearch;

const RoomCard = ({ room }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ my: 1, p: 2 }}>
      <Grid container>
        <Grid item xs={12} sm={4} lg={3}>
          <Typography variant="body2" color="primary">
            Exam Slot
          </Typography>
          <Typography variant="h6">
            {format(room.slot?.date, "do MMM yyyy")}{" "}
            <Chip
              label={room.slot?.timeSlot}
              color={
                room.slot?.timeSlot === "Morning"
                  ? "info"
                  : room.slot?.timeSlot === "Afternoon"
                  ? "warning"
                  : "primary"
              }
            />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Typography variant="body2" color="primary">
            Room
          </Typography>
          <Typography variant="h6">
            {room.room_no} ({room.block})
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} lg={2}>
          <Typography variant="body2" color="primary">
            Seat
          </Typography>
          <Typography variant="h6">{room.student?.seat_no}</Typography>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Typography variant="body2" color="primary">
            Subject Name
          </Typography>
          <Typography variant="h6">{room.student?.subject}</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          lg={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          >
            <KeyboardArrowDown />
          </IconButton>
        </Grid>
      </Grid>
      <Collapse in={expanded}>
        <Divider sx={{ my: 2 }} />
        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Grid container sx={{ mb: 1 }}>
              <Grid item xs={12} sm={4} lg={3}>
                <Typography variant="body2" color="primary">
                  Invigilator 1
                </Typography>
                <Typography variant="h6">
                  {room.invigilator1
                    ? room.invigilator1?.name +
                      " (" +
                      room.invigilator1?.sap_id +
                      ")"
                    : "Not Assigned"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} lg={3}>
                <Typography variant="body2" color="primary">
                  Invigilator 2
                </Typography>
                <Typography variant="h6">
                  {room.invigilator2
                    ? room.invigilator2?.name +
                      " (" +
                      room.invigilator2?.sap_id +
                      ")"
                    : "Not Assigned"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} lg={3}>
                <Typography variant="body2" color="primary">
                  Invigilator 3
                </Typography>
                <Typography variant="h6">
                  {room.invigilator3
                    ? room.invigilator3?.name +
                      " (" +
                      room.invigilator3?.sap_id +
                      ")"
                    : "Not Assigned"}
                </Typography>
              </Grid>
            </Grid>
            {/* Eligibiltiy, Exam type, subject code, attendance*/}
            <Grid container sx={{ mb: 1 }}>
              <Grid item xs={12} sm={4} lg={3}>
                <Typography variant="body2" color="primary">
                  Exam Type
                </Typography>
                <Typography variant="h6">{room.student?.exam_type}</Typography>
              </Grid>
              <Grid item xs={12} sm={4} lg={3}>
                <Typography variant="body2" color="primary">
                  Eligibility
                </Typography>
                <Typography variant="h6">{room.student?.eligible}</Typography>
              </Grid>
              <Grid item xs={12} sm={4} lg={3}>
                <Typography variant="body2" color="primary">
                  Subject Code
                </Typography>
                <Typography variant="h6">
                  {room.student?.subject_code}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} lg={3}>
                <Typography variant="body2" color="primary">
                  Attendance
                </Typography>
                <Typography variant="h6">
                  {room.student?.attendance ? "Present" : "Absent"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Collapse>
    </Card>
  );
};
