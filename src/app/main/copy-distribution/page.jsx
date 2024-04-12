"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UploadBundleModal from "./UploadBundleModal";
import { DataGrid } from "@mui/x-data-grid";
import { getBundleService } from "@/services/copy-distribution";
import { enqueueSnackbar } from "notistack";
import { Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import ManualEntryModal from "./manualEntryModal";

const CopyDistribution = () => {
  const [open, setOpen] = useState(false);
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

  const rows = useMemo(() => {
    return (
      CopyQuery.data?.map((ele) => {
        const formattedDate = formatDate(ele.date_of_exam);
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formattedDate)) {
          enqueueSnackbar({
            variant: "error",
            message: `Error in row with ID ${ele._id}: Date format should be dd/mm/yyyy`,
          });
        }
        return {
          ...ele,
          evaluatorName: ele.evaluator?.name,
          sap: ele.evaluator?.sap_id,
          dateofexam: formattedDate,
          evaluationMode: ele.evaluation_mode,
          subjectName: ele.subject_name,
          subjectCode: ele.subject_code,
          id: ele._id,
        };
      }) || []
    );
  }, [CopyQuery.data]);

  console.log(CopyQuery.data);
  console.log("rows:", rows);

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
      minWidth: 170,
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
      field: "actions",
      headerName: "Actions",
      minWidth: 170,
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
      <Box
        style={{
          height: "80vh",
          width: "calc(100vw - 280px)",
        }}
      >
        <DataGrid rows={rows} columns={cols} pageSize={5} />
      </Box>
    </div>
  );
};
export default CopyDistribution;
