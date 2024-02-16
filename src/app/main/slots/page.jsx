"use client";
import { controllerToken } from "@/config/temp.config";
import { AddExamSlot, getAllExamSlots } from "@/services/exam-slots.service";
import { Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
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

const ExamSlots = () => {
  const [addModal, setAddModal] = React.useState({
    open: false,
  });

  const router = useRouter();

  const SlotQuery = useQuery({
    queryKey: ["slots"],
    queryFn: () => getAllExamSlots(controllerToken),
  });

  const rows = useMemo(() => {
    console.log(SlotQuery.data);
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
      field: "timeSlot",
      headerName: "Slot Type",
      flex: 1,
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
      flex: 0.5,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Tooltip title="View Slot Details" placement="top" arrow>
              <IconButton
                onClick={() => router.push("/main/slotsDetail/" + row._id)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  if (SlotQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        SlotQuery.error.response.status +
        " : " +
        SlotQuery.error.response.data.message,
    });
  }

  return (
    <Box>
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
          <DataGrid
            rows={rows}
            columns={cols}
            pageSize={15}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            disableRowSelectionOnClick
            disableColumnSelector
            disableColumnFilter
          />
        )}
      </Box>
    </Box>
  );
};

export default ExamSlots;

const AddSlotModal = ({ open, handleClose }) => {
  const [date, setDate] = React.useState(new Date());
  const [slotType, setSlotType] = React.useState("Morning");
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () =>
      AddExamSlot(controllerToken, {
        date: date.toLocaleDateString(),
        timeSlot: slotType,
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
        message: error.response.status + " : " + error.response.data.message,
      });
    },
  });

  const handleAddNewSlot = () => {
    console.log(date.toLocaleDateString(), slotType);
    mutate();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add new slot</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Slot Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{ m: 1 }}
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
            <ToggleButton fullWidth value="Morning" aria-label="left aligned">
              Morning
            </ToggleButton>
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
