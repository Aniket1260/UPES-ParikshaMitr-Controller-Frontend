"use client";
import { getBundleByIdService } from "@/services/copy-distribution";
import StatusUpdateModal from "./statusUpdateModal";
import { Grid, Typography, Box, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { refetchInterval } from "@/config/var.config";
import { addDays, differenceInDays, format, isSunday } from "date-fns";

const getChipColor = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "warning";
    case "ALLOTTED":
      return "primary";
    case "INPROGRESS":
      return "info";
    case "SUBMITTED":
      return "success";
    case "OVERDUE":
      return "error";
  }
};

const getChipText = (status, dueIn) => {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "ALLOTTED":
      return "Requested Confirmation";
    case "INPROGRESS":
      return `${dueIn}`;
    case "SUBMITTED":
      return "Submitted";
    case "OVERDUE":
      return `${dueIn}`;
    default:
      return "";
  }
};

const CopyDetails = ({ params }) => {
  const router = useRouter();
  const bundleId = params.id;
  console.log(bundleId);

  const queryClient = useQueryClient();

  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const BundleQuery = useQuery({
    queryKey: ["bundle", controllerToken, bundleId],
    queryFn: () => getBundleByIdService(controllerToken, bundleId),
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
  });
  console.log(BundleQuery.data);

  const sapId = BundleQuery.data && BundleQuery.data[0].evaluator.sap_id;
  const subjectCode = BundleQuery.data && BundleQuery.data[0].subject_code;

  const rows = useMemo(() => {
    if (BundleQuery.data && BundleQuery.data.length > 0) {
      const bundle = BundleQuery.data[0];
      return bundle.copies.map((copy) => ({
        id: copy._id,
        batch: copy.batch,
        numStudents: copy.no_of_students,
        program: copy.program,
        status: copy.status,
        availableDate: copy.available_date,
        allottedDate: copy.allotted_date,
        startDate: copy.start_date,
        submissionDate: copy.submit_date,
        due_in: copy.due_in,
      }));
    }
    return [];
  }, [BundleQuery.data]);
  if (BundleQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        BundleQuery.error.response?.status +
        " : " +
        BundleQuery.error.response?.data.message,
    });
  }

  const [openModal, setOpenModal] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState(null);

  const handleChipClick = (status, copy) => {
    // if (status === "SUBMITTED") return;
    setSelectedCopy(copy);
    setOpenModal(true);
  };

  function getNextWorkingDay(date) {
    const nextDay = addDays(date, 1);
    if (isSunday(nextDay)) {
      return getNextWorkingDay(nextDay);
    }
    return nextDay;
  }

  function getWorkingDateAfterDays(startDate, workingDays) {
    let currentDate = startDate;
    for (let i = 1; i < workingDays; i++) {
      currentDate = getNextWorkingDay(currentDate);
    }
    return currentDate;
  }

  const handleConfirm = () => {
    console.log({
      batch: selectedCopy?.batch,
      program: selectedCopy?.program,
      bundle_id: bundleId,
    });
    setOpenModal(false);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const cols = [
    {
      field: "batch",
      headerName: "Batch",
      minWidth: 100,
    },
    {
      field: "numStudents",
      headerName: "Number of Students",
      minWidth: 170,
    },
    {
      field: "program",
      headerName: "Program",
      minWidth: 180,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 200,
      renderCell: (params) => {
        const { value: status } = params;
        const dueIn = params.row.due_in;
        return (
          <Box>
            <Chip
              label={getChipText(status, dueIn)}
              color={getChipColor(params.value)}
              onClick={() => handleChipClick(status, params.row)}
            >
              {params.value}
            </Chip>
          </Box>
        );
      },
    },
    {
      field: "availableDate",
      headerName: "Available Date",
      //TODO: Add this to StartDate and Submission date and CSV also i.e "dd/MM/yyyy hh:mm a"
      renderCell: (params) => {
        if (params.row.availableDate)
          return format(
            new Date(params.row.availableDate),
            "dd/MM/yyyy hh:mm a"
          );
        return "";
      },
      minWidth: 200,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      renderCell: (params) => {
        if (params.row.startDate)
          return format(new Date(params.row.startDate), "dd/MM/yyyy hh:mm a");
        return "";
      },
      minWidth: 210,
    },
    {
      field: "submissionDate",
      headerName: "Submission Date",
      renderCell: (params) => {
        if (params.row.submissionDate)
          return format(
            new Date(params.row.submissionDate),
            "dd/MM/yyyy hh:mm a"
          );
        return "";
      },
      minWidth: 200,
    },
    {
      field: "abs",
      headerName: "Remark",
      minWidth: 150,
      renderCell: (params) => {
        if (params.row.status === "SUBMITTED") {
          const due_date = params.row.startDate
            ? getWorkingDateAfterDays(new Date(params.row.startDate), 7)
            : "";
          const day_diff = differenceInDays(
            due_date,
            new Date(params.row.submissionDate)
          );

          if (day_diff < 0) {
            return <Chip label="Late Submission" color="error" />;
          }
          return <></>;
        }
      },
    },
  ];
  return (
    <Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Bundle Details
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Evaluator SapId
            </Typography>
            <Typography variant="h5">
              {BundleQuery.data &&
              BundleQuery.data.length > 0 &&
              BundleQuery.data[0].evaluator
                ? BundleQuery.data[0].evaluator.sap_id
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Evaluator Name
            </Typography>
            <Typography variant="h5">
              {BundleQuery.data &&
              BundleQuery.data.length > 0 &&
              BundleQuery.data[0].evaluator
                ? BundleQuery.data[0].evaluator.name
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Subject Name
            </Typography>
            <Typography variant="h5">
              {BundleQuery.data && BundleQuery.data.length > 0
                ? BundleQuery.data[0].subject_name
                : ""}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} mb={3}>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Date of Examination
            </Typography>
            <Typography variant="h5">
              {BundleQuery.data && BundleQuery.data.length > 0
                ? BundleQuery.data[0].date_of_exam
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Evaluation Mode
            </Typography>
            <Typography variant="h5">
              {BundleQuery.data && BundleQuery.data.length > 0
                ? BundleQuery.data[0].evaluation_mode
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Subject School
            </Typography>
            <Typography variant="h5">
              {BundleQuery.data && BundleQuery.data.length > 0
                ? BundleQuery.data[0].subject_school
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              Subject Code
            </Typography>
            <Typography variant="h5">
              {BundleQuery.data && BundleQuery.data.length > 0
                ? BundleQuery.data[0].subject_code
                : ""}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box
        style={{
          height: "80vh",
          width: "calc(100vw - 280px)",
        }}
      >
        <DataGrid
          rows={rows || []}
          columns={cols}
          pageSize={5}
          disableRowSelectionOnClick
        />
        {selectedCopy && (
          <StatusUpdateModal
            open={openModal}
            onClose={handleClose}
            onConfirm={handleConfirm}
            status={selectedCopy.status}
            batch={selectedCopy?.batch}
            program={selectedCopy?.program}
            bundle_id={bundleId}
          />
        )}
      </Box>
    </Box>
  );
};

export default CopyDetails;
