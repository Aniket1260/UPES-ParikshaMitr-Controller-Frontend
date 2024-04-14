"use client";
import {
  getDutyStatusService,
  getSlotsByDate,
} from "@/services/cont-teacher.service";
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
import { da, enIN } from "date-fns/locale";
import { enqueueSnackbar } from "notistack";
import React, { useMemo, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { refetchInterval } from "@/config/var.config";

const DutyStatus = () => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const [activeTab, setActiveTab] = useState("invigilator");
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState(null);

  const SlotGetQuery = useQuery({
    queryKey: ["slot-date", date, controllerToken],
    queryFn: () =>
      getSlotsByDate(
        format(date, "yyyy-MM-dd", { locale: enIN }),
        controllerToken
      ),
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
  });

  const DataQuery = useQuery({
    queryKey: ["slot-date", date, controllerToken, timeSlot],
    queryFn: () =>
      getDutyStatusService(
        format(date, "yyyy-MM-dd", { locale: enIN }),
        timeSlot,
        controllerToken
      ),
    enabled: !!date && !!timeSlot,
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

  if (DataQuery.isError) {
    enqueueSnackbar({
      message:
        DataQuery.error.response?.status +
        " : " +
        DataQuery.error.response?.data.message,
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
          { field: "id", headerName: "ID", minWidth: 100 },
          { field: "Name", headerName: "Name", minWidth: 170 },
          { field: "sap_id", headerName: "SAP ID", minWidth: 120 },
          { field: "phone", headerName: "Phone", minWidth: 130 },
          { field: "email", headerName: "Email", minWidth: 220 },
          { field: "scan_time", headerName: "Scan Time", minWidth: 170 },
          { field: "room", headerName: "Room", minWidth: 120 },
          {
            field: "attendance",
            headerName: "Attendance",
            minWidth: 180,
            valueGetter: (params) =>
              params?.row?.attendance === true ? "P" : "A",
            renderCell: (params) => (
              <Box
                sx={{
                  backgroundColor:
                    params.value === "P" ? "darkgreen" : "#ad1313",
                  color: "white",
                  padding: "5px",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Typography variant="body1" py={1}>
                  {params.value}
                </Typography>
              </Box>
            ),
          },
        ]
      : [
          { field: "id", headerName: "ID", minWidth: 30 },
          { field: "Name", headerName: "Name", minWidth: 170 },
          { field: "sap_id", headerName: "SAP ID", minWidth: 120 },
          { field: "in_time", headerName: "In Time", minWidth: 100 },
          { field: "out_time", headerName: "Out Time", minWidth: 100 },
          { field: "rooms", headerName: "Rooms Assigned", minWidth: 90 },
          { field: "phone", headerName: "Phone", minWidth: 130 },
          { field: "email", headerName: "Email", minWidth: 200 },
          { field: "status", headerName: "Status", minWidth: 100 },
          {
            field: "final_remarks",
            headerName: "Final Remarks",
            minWidth: 150,
          },
        ];

  const rows = useMemo(() => {
    if (DataQuery.isSuccess) {
      if (activeTab === "invigilator") {
        console.log(DataQuery.data?.invigilators);
        return DataQuery.data?.invigilators
          .sort((a, b) => {
            if (a.scan_time && b.scan_time) {
              // console.log(new Date("1/1/1999 " + a.scan_time));
              return new Date("1/1/1999 " + a.scan_time) >
                new Date("1/1/1999 " + b.scan_time)
                ? -1
                : 1;
            } else {
              return 0;
            }
          })
          .map((invigilator, index) => ({
            id: index + 1,
            ...invigilator,
          }));
        // Sort by scan time, latest first
      } else {
        return DataQuery.data?.flying
          .sort((a, b) => {
            if (a.scan_time && b.scan_time) {
              // console.log(new Date("1/1/1999 " + a.scan_time));
              return new Date("1/1/1999 " + a.scan_time) >
                new Date("1/1/1999 " + b.scan_time)
                ? -1
                : 1;
            } else {
              return 0;
            }
          })
          .map((flyingSquad, index) => ({
            id: index + 1,
            ...flyingSquad,
          }));
      }
    }

    return [];
  }, [DataQuery.data, activeTab, DataQuery.isSuccess]);

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
                <ToggleButton value={slot?.timeSlot} key={slot?._id}>
                  {slot?.timeSlot}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Box>
      </Box>
      {/* {SlotGetQuery.isSuccess && console.log(SlotGetQuery.data)} */}
      {DataQuery.isLoading && <CircularProgress />}
      {DataQuery.isSuccess && (
        <Box>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            sx={{ my: 2 }}
          >
            <Tab value="invigilator" label="Invigilator" />
            <Tab value="flyingSquad" label="Flying Squad" />
          </Tabs>

          {/* {getDataQuery.isSuccess && ( */}
          <Box
            style={{
              height: "80vh",
              width: "calc(100vw - 280px)",
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              checkboxSelection={false}
              disableSelectionOnClick
              disableRowSelectionOnClick
              // loading={getDataQuery.isLoading}
              slots={{
                toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport
                      csvOptions={{
                        fileName: `duty_status_${activeTab}_${format(
                          date,
                          "dd-MM-yyyy",
                          { locale: enIN }
                        )}`,
                      }}
                    />
                  </GridToolbarContainer>
                ),
              }}
            />
          </Box>
          {/* )} */}
        </Box>
      )}
    </Box>
  );
};
export default DutyStatus;
