"use client";
import { Grid, Typography, Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CopyDetails = () => {
  const router = useRouter();

  const queryClient = useQueryClient();

  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const cols = [
    {
      field: "batch",
      headerName: "Batch",
      flex: 1,
    },
    {
      field: "numStudents",
      headerName: "Number of Students",
      flex: 1,
    },
    {
      field: "program",
      headerName: "Program",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "allottedDate",
      headerName: "Allotted Date",
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
    },
  ];
  return (
    <div>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Bundle Details
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Evaluator SapId
            </Typography>

            <Typography variant="h5"></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Evaluator Name
            </Typography>
            <Typography variant="h5"></Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Date of Examination
            </Typography>
            <Typography variant="h5"></Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Evaluation Mode
            </Typography>
            <Typography variant="h5"></Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Subject Name
            </Typography>
            <Typography variant="h5"></Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Subject Code
            </Typography>
            <Typography variant="h5"></Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default CopyDetails;
