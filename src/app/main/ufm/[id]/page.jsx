"use client";
import { getUFMBySlotService } from "@/services/cont-ufm.service";
import { Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useMemo } from "react";

const UFMBySlot = ({ params }) => {
  const { id: slotId } = params;

  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const router = useRouter();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const UFMBySlotQuery = useQuery({
    queryKey: ["ufm", slotId, controllerToken],
    queryFn: () => getUFMBySlotService(slotId, controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  if (UFMBySlotQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        UFMBySlotQuery.error.response?.status +
        " : " +
        UFMBySlotQuery.error.response?.data.message,
    });
  }

  const rows = useMemo(() => {
    if (UFMBySlotQuery.data) {
      return UFMBySlotQuery.data.slot.ufms.map((item, index) => {
        return { ...item, id: index + 1 };
      });
    }
    return [];
  }, [UFMBySlotQuery.data]);

  const cols = [
    {
      field: "id",
      headerName: "#",
      minWidth: 100,
    },
    {
      field: "sap_id",
      headerName: "SAP ID",
      minWidth: 170,
      renderCell: (params) => {
        return <Typography>{params.row.student?.sap_id}</Typography>;
      },
    },
    {
      field: "roll+np",
      headerName: "Roll No.",
      minWidth: 250,
      renderCell: (params) => {
        return <Typography>{params.row.student?.roll_no}</Typography>;
      },
    },
    {
      field: "name",
      headerName: "Student Name",
      minWidth: 230,
      renderCell: (params) => {
        return <Typography>{params.row.student?.name}</Typography>;
      },
    },
    {
      field: "room",
      headerName: "Room",
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Typography>
            {params.row.room?.room_no} ({params.row.room?.block})
          </Typography>
        );
      },
    },
    {
      field: "seat",
      headerName: "Seat No.",
      minWidth: 100,
      renderCell: (params) => {
        return <Typography>{params.row.student?.seat_no}</Typography>;
      },
    },
    {
      field: "subject",
      headerName: "Subject",
      minWidth: 160,
      renderCell: (params) => {
        return <Typography>{params.row.subject?.subject_name}</Typography>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Box>
            <Tooltip title="View Details" arrow placement="top">
              <IconButton
                onClick={() => {
                  router.push(`/main/ufm/details/${params.row._id}`);
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          UFM Details for Slot
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(`/main/ufm/${slotId}`)}
        >
          UFM Redressal
        </Button>
      </Grid>
      {UFMBySlotQuery.isLoading && <CircularProgress />}
      {UFMBySlotQuery.isSuccess && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="primary">
                Date
              </Typography>
              <Typography variant="h5">
                {UFMBySlotQuery.data?.slot?.date}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="primary">
                Time Slot
              </Typography>
              <Typography variant="h5">
                {UFMBySlotQuery.data?.slot?.timeSlot}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="primary">
                Exam Type
              </Typography>
              <Typography variant="h5">
                {UFMBySlotQuery.data?.slot?.type}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="primary">
                Total UFM
              </Typography>
              <Typography variant="h5">
                {UFMBySlotQuery.data?.slot?.ufms?.length}
              </Typography>
            </Grid>
          </Grid>
          <Box
            style={{
              height: "80vh",
              width: "calc(100vw - 280px)",
            }}
          >
            <DataGrid
              rows={rows}
              columns={cols}
              disableRowSelectionOnClick
              slots={{
                toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport
                      csvOptions={{
                        fileName: `ufm_slotId_${slotId}_${formatDate(
                          UFMBySlotQuery.data.slot.date
                        )}`,
                      }}
                    />
                  </GridToolbarContainer>
                ),
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default UFMBySlot;
