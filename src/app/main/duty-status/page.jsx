"use client";
import { getSlotsByDate } from "@/services/cont-teacher.service";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { enIN } from "date-fns/locale";
import { enqueueSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const DutyStatus = () => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const [activeTab, setActiveTab] = useState("invigilator");
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("Morning");

  const SlotGetQuery = useQuery({
    queryKey: ["slot-date", date, controllerToken],
    queryFn: () =>
      getSlotsByDate(
        format(date, "yyyy-MM-dd", { locale: enIN }),
        controllerToken
      ),
  });

  if (SlotGetQuery.isError) {
    enqueueSnackbar({
      message:
        SlotGetQuery.error.response?.status +
        " : " +
        SlotGetQuery.error.response?.data.message,
      variant: "error",
    });
  }

  // const getDataQuery = useQuery({
  //   queryKey: ["slot-date", date, controllerToken, activeTab],
  //   queryFn: () => {
  //     return activeTab === "invigilator" ? "invigilator" : "flyingSquad";// here service would be called to get data
  //   },
  // });

  // if (getDataQuery.isError) {
  //   enqueueSnackbar({
  //     message:
  //       getDataQuery.error.response?.status +
  //       " : " +
  //       getDataQuery.error.response?.data.message,
  //     variant: "error",
  //   });
  // }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const columns =
    activeTab === "invigilator"
      ? [
          { field: "id", headerName: "ID", width: 150 },
          { field: "name", headerName: "Name", width: 200 },
          { field: "sapid", headerName: "SAP ID", width: 150 },
          { field: "phone", headerName: "Phone", width: 150 },
          { field: "email", headerName: "Email", width: 150 },
          { field: "scanTime", headerName: "Scan Time", width: 150 },
          { field: "room", headerName: "Room", width: 150 },
          { field: "attendance", headerName: "Attendance", width: 150 },
        ]
      : [
          { field: "id", headerName: "ID", width: 100 },
          { field: "name", headerName: "Name", width: 150 },
          { field: "sapid", headerName: "SAP ID", width: 100 },
          { field: "inTime", headerName: "In Time", width: 100 },
          { field: "outTime", headerName: "Out Time", width: 100 },
          { field: "room", headerName: "Room", width: 100 },
          { field: "phone", headerName: "Phone", width: 100 },
          { field: "email", headerName: "Email", width: 150 },
          { field: "status", headerName: "Status", width: 150 },
          { field: "final_remarks", headerName: "Final Remarks", width: 150 },
        ];

  const rows = useMemo(() => {
    // here we will define the row data
    return [];
  });

  return (
    <Box>
      <Typography variant="h4">
        Duty Status {SlotGetQuery.isLoading && <CircularProgress />}
      </Typography>

      <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
        <Box>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            // adapterLocale={enIN}
          >
            <DatePicker
              label="Slot Date"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
                setTimeSlot("");
              }}
              sx={{ m: 1 }}
              format="dd/MM/yyyy"
            />
          </LocalizationProvider>
        </Box>
        <Box>
          {SlotGetQuery.isSuccess && (
            <ToggleButtonGroup
              value={timeSlot}
              exclusive
              onChange={(e, newSlot) => {
                if (newSlot !== null) {
                  setTimeSlot(newSlot);
                }
              }}
              size="large"
              variant="outlined"
              sx={{ ml: 2 }}
            >
              {SlotGetQuery.data.data?.map((slot) => (
                <ToggleButton value={slot?._id} key={slot?._id}>
                  {slot?.timeSlot}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Box>
      </Box>
      {/* {SlotGetQuery.isSuccess && console.log(SlotGetQuery.data)} */}

      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        sx={{ mt: 2 }}
      >
        <Tab value="invigilator" label="Invigilator" />
        <Tab value="flyingSquad" label="Flying Squad" />
      </Tabs>

      {/* {getDataQuery.isSuccess && ( */}
      <Box style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection={false}
          disableSelectionOnClick
          // loading={getDataQuery.isLoading}
        />
      </Box>
      {/* )} */}
    </Box>
  );
};
export default DutyStatus;
