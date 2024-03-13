"use client";
import { getTeacherAttendance } from "@/services/cont-teacher.service";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useMemo } from "react";

const AttendanceReport = () => {
  const tableApiRef = useGridApiRef();

  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }
  const AttendanceQuery = useQuery({
    queryKey: ["attendance", controllerToken],
    queryFn: () => getTeacherAttendance(controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  if (AttendanceQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        AttendanceQuery.error.response?.status +
        " : " +
        AttendanceQuery.error.response?.data.message,
    });
  }

  const cols = useMemo(() => {
    if (!AttendanceQuery.data?.data) {
      return [];
    }
    const cols = [
      {
        field: "name",
        headerName: "Teacher Name",
        width: 200,
        renderCell: (params) => {
          return (
            <Box>
              <Typography variant="body1" py={1}>
                {params.value}
              </Typography>
            </Box>
          );
        },
      },
    ];
    AttendanceQuery.data?.data?.allSlotsData.forEach((slot) => {
      slot.timeSlots.forEach((timeSlot) => {
        cols.push({
          field: `${slot.date}_${timeSlot}`,
          headerName: timeSlot,
          renderCell: (params) => {
            return (
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
            );
          },
        });
      });
    });
    return cols;
  }, [AttendanceQuery.data]);

  const colGroup = useMemo(() => {
    if (!AttendanceQuery.data?.data) {
      return [];
    }
    const colGroup = [];
    AttendanceQuery.data?.data?.allSlotsData.forEach((slot) => {
      colGroup.push({
        groupId: slot.date,
        description: "",
        children: [
          ...cols
            .filter((col) => col.field.split("_")[0] === slot.date)
            .map((col) => ({ field: col.field })),
        ],
      });
    });
    return colGroup;
  }, [AttendanceQuery.data, cols]);

  const rows = useMemo(() => {
    if (!AttendanceQuery.data) {
      return [];
    }
    const rows = [];
    AttendanceQuery.data?.data?.teacherAttendance.forEach((teacher) => {
      const row = {
        id: teacher._id,
        name: teacher.teacher,
      };
      teacher.attendance.forEach((slot) => {
        row[`${slot.slot_date}_${slot.slot_type}`] = slot.attendance
          ? "P"
          : "A";
      });
      rows.push(row);
    });
    return rows;
  }, [AttendanceQuery.data]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Attendance Report</Typography>
        <Button
          variant="outlined"
          onClick={() =>
            tableApiRef.current.exportDataAsCsv({
              fileName: "Attendance Report",
            })
          }
        >
          Export as CSV
        </Button>
      </Box>
      {AttendanceQuery.isLoading && <CircularProgress />}
      {AttendanceQuery.isSuccess && (
        <Box style={{ height: "80vh", width: "100%" }}>
          <DataGrid
            experimentalFeatures={{ columnGrouping: true }}
            rows={rows}
            columns={cols}
            columnGroupingModel={colGroup}
            getRowHeight={() => "auto"}
            getEstimatedRowHeight={() => 200}
            rowSelection={false}
            apiRef={tableApiRef}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "normal",
                lineHeight: "normal",
              },
              "& .MuiDataGrid-columnHeader": {
                // Forced to use important since overriding inline styles
                height: "unset !important",
              },
              "& .MuiDataGrid-columnHeaders": {
                // Forced to use important since overriding inline styles
                maxHeight: "168px !important",
              },
              "& .MuiDataGrid-root .MuiDataGrid-cell": {
                whiteSpace: "normal",
                lineHeight: "normal",
                maxHeight: "168px !important",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AttendanceReport;
