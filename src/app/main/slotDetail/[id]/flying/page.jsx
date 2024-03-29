"use client";
import { getFlyingDetailsBySlotID } from "@/services/flying.service";
import { Add, Refresh, Visibility } from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import DetailsModal from "./flyingDetailModal";
import AssignRoomModal from "./AssignRoomsModal";

const SlotFlying = ({ params }) => {
  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }

  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState({
    isOpen: false,
    flyingId: null,
    rooms_assigned: [],
    name: null,
  });
  const handleViewDetails = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };
  const queryClient = useQueryClient();
  const { id: slotId } = params;

  const FlyingQuery = useQuery({
    queryKey: ["flying", slotId, controllerToken],
    queryFn: () => getFlyingDetailsBySlotID(controllerToken, slotId),
  });

  if (FlyingQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        FlyingQuery.error.response?.status +
        " : " +
        FlyingQuery.error.response?.data.message,
    });
  }
  const rows = useMemo(() => {
    if (FlyingQuery.data) {
      console.log(FlyingQuery.data);
      return FlyingQuery.data.map((item, index) => {
        return { ...item, id: index + 1 };
      });
    }
    return [];
  }, [FlyingQuery.data]);

  const cols = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "sap_id",
      headerName: "SAP ID",
      width: 150,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params.row?.teacher_id?.sap_id}
          </Typography>
        );
      },
    },
    {
      field: "teacher_name",
      headerName: "Teacher Name",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body1">
              {params.row?.teacher_id?.name}
            </Typography>
            <Chip label={params.row?.status} />
          </Box>
        );
      },
    },

    {
      field: "phone",
      headerName: "Phone Number",
      width: 150,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params.row?.teacher_id?.phone}
          </Typography>
        );
      },
    },
    {
      field: "rooms_assigned",
      headerName: "Rooms Assigned",
      width: 150,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {params.row?.rooms_assigned?.length}
          </Typography>
        );
      },
    },
    {
      field: "rooms_requested",
      headerName: "Approvals Pending",
      width: 150,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {
              params.row?.rooms_assigned?.filter(
                (ele) => ele.status === "requested"
              ).length
            }
          </Typography>
        );
      },
    },
    {
      field: "rooms_completed",
      headerName: "Rooms Completed",
      width: 150,
      renderCell: (params) => {
        return (
          <Typography variant="body1">
            {
              params.row?.rooms_assigned?.filter(
                (ele) => ele.status === "approved"
              ).length
            }
          </Typography>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <Box>
            <Tooltip title="View Details" placement="top" arrow>
              <IconButton
                onClick={() => {
                  console.log(params.row);
                  handleViewDetails(params.row);
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Assign Rooms" placement="top" arrow>
              <IconButton
                onClick={() => {
                  console.log(params.row);
                  setAssignModal({
                    isOpen: true,
                    flyingId: params.row._id,
                    name: params.row.teacher_id?.name,
                    rooms_assigned: params.row.rooms_assigned,
                  });
                }}
              >
                <Add />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h4">
        Flying Details{" "}
        <IconButton
          onClick={() =>
            queryClient.invalidateQueries(["flying", slotId, controllerToken])
          }
        >
          <Refresh />
        </IconButton>
      </Typography>
      <Box sx={{ mt: 2 }}>
        <DetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedRow={selectedRow}
        />
        <AssignRoomModal
          isOpen={assignModal.isOpen}
          onClose={() =>
            setAssignModal({
              isOpen: false,
              flyingId: null,
              name: null,
              rooms_assigned: [],
            })
          }
          slotId={slotId}
          flyingId={assignModal.flyingId}
          name={assignModal.name}
          rooms_assigned={assignModal.rooms_assigned}
        />
        {FlyingQuery.isLoading && <CircularProgress />}
        {FlyingQuery.isSuccess && (
          <Box style={{ height: "80vh", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={cols}
              disableSelectionOnClick
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SlotFlying;
