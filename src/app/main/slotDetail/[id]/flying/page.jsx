"use client";
import { getFlyingDetailsBySlotID } from "@/services/flying.service";
import {
  Add,
  Assignment,
  Check,
  Refresh,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import DetailsModal from "./flyingDetailModal";
import AssignRoomModal from "./AssignRoomsModal";
import CompleteFlyingModal from "./CompleteFlyingModal";
import AddFlyingModal from "./AddFlyingModal";
import { refetchInterval } from "@/config/var.config";

const getChipColor = (status) => {
  switch (status.toLowerCase()) {
    case "not started":
      return "warning";
    case "ongoing":
      return "info";
    case "completed":
      return "success";
  }
};

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
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
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
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [flyingToComplete, setFlyingToComplete] = useState(null);
  const [isAddFlyingModalOpen, setIsAddFlyingModalOpen] = useState(false);

  const handleCompleteFlying = (flying) => {
    setFlyingToComplete(flying);
    setIsCompleteModalOpen(true);
  };

  const handleAddFlying = () => {
    setIsAddFlyingModalOpen(true);
  };

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
      minWidth: 70,
    },
    {
      field: "sap_id",
      headerName: "SAP ID",
      minWidth: 140,
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
      minWidth: 340,
      renderCell: (params) => {
        const status = params.row?.status.replace(/\b\w/g, (char) =>
          char.toUpperCase()
        );
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body1">
              {params.row?.teacher_id?.name}
            </Typography>
            <Chip label={status} color={getChipColor(params.row.status)} />
          </Box>
        );
      },
    },

    {
      field: "phone",
      headerName: "Phone Number",
      minWidth: 130,
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
      minWidth: 110,
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
      minWidth: 110,
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
      minWidth: 130,
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
      minWidth: 150,
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
            {params.row.status === "ongoing" && (
              <Tooltip
                title="Complete Duty of Flying"
                placement="top"
                arrow
                onClick={() => handleCompleteFlying(params.row)}
              >
                <IconButton>
                  <Check />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
        <Typography variant="h6">
          <Button color="primary" variant="contained" onClick={handleAddFlying}>
            Add Flying
          </Button>
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <DetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedRow={selectedRow}
        />
        <AddFlyingModal
          isOpen={isAddFlyingModalOpen}
          onClose={() => setIsAddFlyingModalOpen(false)}
          slotId={slotId}
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
        <CompleteFlyingModal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          flying={flyingToComplete}
        />
        {FlyingQuery.isLoading && <CircularProgress />}
        {FlyingQuery.isSuccess && (
          <Box
            style={{
              height: "80vh",
              width: "calc(100vw - 280px)",
            }}
          >
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
