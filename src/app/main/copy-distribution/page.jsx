"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UploadBundleModal from "./UploadBundleModal";
import { DataGrid } from "@mui/x-data-grid";
import { getBundleService } from "@/services/copy-distribution";
import { enqueueSnackbar } from "notistack";
import { Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ManualEntryModal from "./manualEntryModal";
import DownloadMasterCSV from "./downloadCSV";
import { refetchInterval } from "@/config/var.config";
import { addDays, differenceInDays, isSunday } from "date-fns";

const getChipColor = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "warning";
    case "ALLOTTED":
      return "primary";
    case "PARTIAL":
      return "info";
    case "PARTIAL ALLOT":
      return "info";
    case "INPROGRESS":
      return "info";
    case "SUBMITTED":
      return "success";
    case "OVERDUE":
      return "error";
    case "NO COPIES":
      return "error";
  }
};

const getChipText = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "ALLOTTED":
      return "Requested Confirmation";
    case "INPROGRESS":
      return `In Checking`;
    case "SUBMITTED":
      return "Submitted";
    case "OVERDUE":
      return `Overdue`;
    case "PARTIAL":
      return `Partially Checked`;
    case "PARTIAL ALLOT":
      return `Partially Allotted`;
    case "NO COPIES":
      return `No Copies`;
    default:
      return "";
  }
};

const CopyDistribution = () => {
  const [open, setOpen] = useState(false);
  const [schoolSelected, setSchoolSelected] = useState("A");
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const queryClient = useQueryClient();
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const CopyQuery = useQuery({
    queryKey: ["bundle", controllerToken],
    queryFn: () => getBundleService(controllerToken),
    cacheTime: 0,
    refetchIntervalInBackground: true,
    refetchInterval: refetchInterval,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const handleManualEntryClose = () => {
    setManualEntryOpen(false);
  };

  const handleManualEntryOpen = () => {
    setManualEntryOpen(true);
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

  const rows = useMemo(() => {
    return (
      CopyQuery.data
        ?.filter((ele) => {
          if (schoolSelected === "A") {
            return true;
          }
          return ele.subject_school === schoolSelected;
        })
        .map((ele) => {
          const formattedDate = formatDate(ele.date_of_exam);
          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formattedDate)) {
            enqueueSnackbar({
              variant: "error",
              message: `Error in row with ID ${ele._id}: Date format should be dd/mm/yyyy`,
            });
          }

          let row_status = "INPROGRESS";

          // change row status based on copies status
          // even if one copy is OVERDUE, the row status will be OVERDUE
          // if all copies are AVAILABLE or ALLOTTED, the row status will be AVAILABLE
          // if all copies are INPROGRESS, the row status will be INPROGRESS
          // if some copies are INPROGRESS and some are SUBMITTED, the row status will be PARTIAL
          // else if all copies are SUBMITTED, the row status will be SUBMITTED
          let ovr_count = 0;
          let sub_count = 0;
          let inprog_count = 0;
          let avail_count = 0;
          let allot_count = 0;
          ele.copies.forEach((copy) => {
            switch (copy.status) {
              case "SUBMITTED":
                sub_count++;
                break;
              case "INPROGRESS":
                const due_date = copy.available_date
                  ? getWorkingDateAfterDays(new Date(copy.available_date), 7)
                  : "";
                const day_diff = differenceInDays(due_date, new Date());
                console.log(day_diff);

                if (day_diff < 0) {
                  ovr_count++;
                } else {
                  inprog_count++;
                }
                break;
              case "AVAILABLE":
                avail_count++;
                break;
              case "ALLOTTED":
                allot_count++;
                break;
            }
          });
          console.log(
            ovr_count,
            sub_count,
            inprog_count,
            avail_count,
            allot_count
          );
          if (ovr_count > 0) {
            row_status = "OVERDUE";
          } else if (sub_count === ele.copies.length) {
            row_status = "SUBMITTED";
          } else if (inprog_count === ele.copies.length) {
            row_status = "INPROGRESS";
          } else if (sub_count > 0 && inprog_count > 0) {
            row_status = "PARTIAL";
          } else if (sub_count > 0 && (avail_count > 0 || allot_count > 0)) {
            row_status = "PARTIAL ALLOT";
          } else if (avail_count + allot_count === ele.copies.length) {
            row_status = "AVAILABLE";
          }

          if (ele.copies.length === 0) {
            row_status = "NO COPIES";
          }

          return {
            ...ele,
            evaluatorName: ele.evaluator?.name,
            sap: ele.evaluator?.sap_id,
            dateofexam: formattedDate,
            evaluationMode: ele.evaluation_mode,
            subjectName: ele.subject_name,
            subjectCode: ele.subject_code,
            subjectSchool: ele.subject_school,
            roomNo: ele.room_no,
            status: row_status,
            id: ele._id,
          };
        })
        .sort((a, b) => {
          // Submitted at the bottom
          if (a.status === "SUBMITTED" && b.status !== "SUBMITTED") {
            return 1;
          }
          if (b.status === "SUBMITTED" && a.status !== "SUBMITTED") {
            return -1;
          }
          // Overdue at the top
          if (a.status === "OVERDUE" && b.status !== "OVERDUE") {
            return -1;
          }
          if (b.status === "OVERDUE" && a.status !== "OVERDUE") {
            return 1;
          }
        }) || []
    );
  }, [CopyQuery.data, schoolSelected]);
  console.log(rows);
  if (CopyQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        CopyQuery.error.response?.status +
        " : " +
        CopyQuery.error.response?.data.message,
    });
  }

  const cols = [
    {
      field: "evaluatorName",
      headerName: "Evaluator Name",
      minWidth: 200,
    },
    {
      field: "sap",
      headerName: "Evaluator SapId",
      minWidth: 150,
    },
    {
      field: "dateofexam",
      headerName: "Date Of Examination",
      minWidth: 200,
    },
    {
      field: "evaluationMode",
      headerName: "Evaluation Mode",
      minWidth: 170,
    },
    {
      field: "subjectName",
      headerName: "Subject Name",
      minWidth: 175,
    },
    {
      field: "subjectCode",
      headerName: "Subject Code",
      minWidth: 170,
    },
    {
      field: "subjectSchool",
      headerName: "Subject School",
      minWidth: 150,
    },
    {
      field: "roomNo",
      headerName: "Room No.",
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      renderCell: (params) => {
        return (
          <Box>
            <Chip
              label={getChipText(params.value)}
              color={getChipColor(params.value)}
            >
              {params.value}
            </Chip>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 190,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Tooltip title="View Bundle Details" placement="top" arrow>
              <IconButton
                onClick={() =>
                  router.push("/main/copy-distribution/" + row._id)
                }
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
    <div>
      <Box display="flex" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Copy Distribution Bundle</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <DownloadMasterCSV data={rows} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleManualEntryOpen}
          >
            Manual Entry
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add Bundles
          </Button>
        </Box>
      </Box>
      <UploadBundleModal open={open} onClose={handleClose} />
      <ManualEntryModal
        open={manualEntryOpen}
        onClose={handleManualEntryClose}
        columns={cols}
      />
      <Select
        sx={{ marginBottom: 2 }}
        value={schoolSelected}
        onChange={(e) => setSchoolSelected(e.target.value)}
      >
        <MenuItem value="A">Select School</MenuItem>
        <MenuItem value="SOHST">SOHST</MenuItem>
        <MenuItem value="SOCS">SOCS</MenuItem>
        <MenuItem value="SOE">SOE</MenuItem>
        <MenuItem value="SOD">SOD</MenuItem>
      </Select>
      <Box
        style={{
          height: "80vh",
          width: "calc(100vw - 280px)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={cols}
          pageSize={5}
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
};
export default CopyDistribution;
