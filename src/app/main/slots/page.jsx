"use client";
import {
  AddExamSlot,
  DeleteSlotService,
  getAllExamSlots,
} from "@/services/exam-slots.service";
import { Ballot, Call, Delete, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { enIN } from "date-fns/locale";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useMemo } from "react";
import UploadSeatingPlan from "./UploadSeatingPlan";
import ContactModal from "./ContactModal";

const ExamSlots = () => {
  const [addModal, setAddModal] = React.useState({
    open: false,
  });

  const queryClient = useQueryClient();

  const [uploadSeatingPlanModal, setUploadSeatingPlanModal] = React.useState({
    open: false,
    slot: null,
  });

  const [contactModal, setContactModal] = React.useState({
    open: false,
    slot_id: null,
  });

  const router = useRouter();
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const SlotQuery = useQuery({
    queryKey: ["slots", controllerToken],
    queryFn: () => getAllExamSlots(controllerToken),
  });

  const { mutate: deleteSlot } = useMutation({
    mutationFn: (slotId) => DeleteSlotService(controllerToken, slotId),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Slot deleted successfully",
      });
      queryClient.invalidateQueries("slots");
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  const rows = useMemo(() => {
    return SlotQuery.data?.map((ele, idx) => ({
      ...ele,
      id: idx + 1,
    }));
  }, [SlotQuery.data]);

  const cols = [
    {
      field: "date",
      headerName: "Slot Date",
      flex: 1,
      renderCell: (params) => {
        return format(new Date(params.value), "do MMM yyyy");
      },
    },
    {
      field: "type",
      headerName: "Slot Type",
      flex: 1,
    },
    {
      field: "timeSlot",
      headerName: "Time Slot",
      flex: 1,
      renderCell: (params) => {
        return (
          <Chip
            variant="soft"
            label={params.value}
            color={
              params.value === "Morning"
                ? "info"
                : params.value === "Afternoon"
                ? "warning"
                : "primary"
            }
          />
        );
      },
    },
    {
      field: "uniqueCode",
      headerName: "Unique Code",
      flex: 1,
    },
    {
      field: "rooms",
      headerName: "No. of Rooms Alloted",
      flex: 0.5,
      renderCell: ({ row }) => {
        return row?.rooms?.length;
      },
    },
    {
      field: "_",
      headerName: "Actions",
      flex: 0.6,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Tooltip title="View Slot Details" placement="top" arrow>
              <IconButton
                onClick={() => router.push("/main/slotDetail/" + row._id)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Slot Contact Details" placement="top" arrow>
              <IconButton
                onClick={() =>
                  setContactModal({
                    open: true,
                    slot_id: row._id,
                  })
                }
              >
                <Call />
              </IconButton>
            </Tooltip> */}
            {row?.rooms?.length == 0 && (
              <Tooltip title="Upload Seating Plan" placement="top" arrow>
                <IconButton
                  onClick={() =>
                    setUploadSeatingPlanModal({
                      open: true,
                      slot: row,
                    })
                  }
                >
                  <Ballot />
                </IconButton>
              </Tooltip>
            )}
            {row?.isDeletable && (
              <Tooltip title="Delete Slot" placement="top" arrow>
                <IconButton onClick={() => deleteSlot(row._id)}>
                  <Delete color="error" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  if (SlotQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        SlotQuery.error.response?.status +
        " : " +
        SlotQuery.error.response?.data.message,
    });
  }

  return (
    <Box>
      <ContactModal
        open={contactModal.open}
        handleClose={() =>
          setContactModal({
            open: false,
            slot_id: null,
          })
        }
        slot_id={contactModal.slot_id}
      />
      <UploadSeatingPlan
        open={uploadSeatingPlanModal.open}
        handleClose={() =>
          setUploadSeatingPlanModal({
            open: false,
            slot: null,
          })
        }
        slot={uploadSeatingPlanModal.slot}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Examination slots</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddModal((prev) => ({ ...prev, open: true }))}
        >
          Add Slot
        </Button>
      </Box>
      <AddSlotModal
        open={addModal.open}
        handleClose={() => setAddModal((prev) => ({ ...prev, open: false }))}
      />
      <Box sx={{ pt: 2 }}>
        {SlotQuery.isLoading && <CircularProgress />}
        {SlotQuery.isSuccess && rows.length > 0 && (
          <Box style={{ height: "80vh", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={cols}
              pageSize={15}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              disableRowSelectionOnClick
              // disableColumnSelector
              // disableColumnFilter
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExamSlots;

const AddSlotModal = ({ open, handleClose }) => {
  const [date, setDate] = React.useState(new Date());
  const [slotType, setSlotType] = React.useState("Endsem");
  const [timeSlot, setTimeSlot] = React.useState("Morning");
  const queryClient = useQueryClient();

  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const { mutate } = useMutation({
    mutationFn: () =>
      AddExamSlot(controllerToken, {
        date: date.toLocaleDateString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
        timeSlot: timeSlot,
        type: slotType,
        rooms: [],
      }),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Slot added successfully",
      });
      queryClient.invalidateQueries("slots");
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
      });
    },
  });

  const handleAddNewSlot = () => {
    mutate();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add new slot</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enIN}>
          <DatePicker
            label="Slot Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ m: 1 }}
            format="dd/MM/yyyy"
          />
        </LocalizationProvider>
        <Box sx={{ m: 1 }}>
          <Typography variant="body1">Slot Type</Typography>
          <ToggleButtonGroup
            value={slotType}
            exclusive
            onChange={(e, newValue) => setSlotType(newValue)}
            aria-label="text alignment"
            sx={{ width: "100%" }}
          >
            <ToggleButton fullWidth value="Midsem" aria-label="left aligned">
              Midsem
            </ToggleButton>
            <ToggleButton fullWidth value="Endsem" aria-label="right aligned">
              Endsem
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ m: 1 }}>
          <Typography variant="body1">Slot Time Slot</Typography>
          <ToggleButtonGroup
            value={timeSlot}
            exclusive
            onChange={(e, newValue) => setTimeSlot(newValue)}
            aria-label="text alignment"
            sx={{ width: "100%" }}
          >
            <ToggleButton fullWidth value="Morning" aria-label="left aligned">
              Morning
            </ToggleButton>
            {slotType === "Midsem" && (
              <ToggleButton fullWidth value="Afternoon" aria-label="centered">
                Afternoon
              </ToggleButton>
            )}
            <ToggleButton fullWidth value="Evening" aria-label="right aligned">
              Evening
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{ m: 1, mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewSlot}
          >
            Add Slot
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
