"use client";
import { Grid, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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
      minWidth: 200,
    },
    {
      field: "numStudents",
      headerName: "Number of Students",
      minWidth: 200,
    },
    {
      field: "program",
      headerName: "Program",
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
    },
    {
      field: "allottedDate",
      headerName: "Allotted Date",
      minWidth: 200,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 210,
    },
  ];
  return (
    <div>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Bundle Details
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Evaluator SapId
            </Typography>

            <Typography variant="h5"></Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Evaluator Name
            </Typography>
            <Typography variant="h5">khus</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} mb={3}>
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
            <Typography variant="h5">abc</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <DataGrid rows={[]} columns={cols} pageSize={5} />
      </Box>
    </div>
  );
};

export default CopyDetails;
