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

const CopyDistribution = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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

  const rows = useMemo(() => {
    return (
      CopyQuery.data?.map((ele) => ({
        ...ele,
        evaluatorName: ele.evaluator?.name, // Accessing the name field under evaluator
        sap: ele.evaluator?.sap_id, // Accessing the sap_id field under evaluator
        dateofexam: ele.date_of_exam, // Directly accessing the date_of_exam field
        evaluationMode: ele.evaluation_mode, // Directly accessing the evaluation_mode field
        subjectName: ele.subject_name, // Directly accessing the subject_name field
        subjectCode: ele.subject_code, // Directly accessing the subject_code field
        id: ele._id,
      })) || []
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
      flex: 1,
    },
    {
      field: "sap",
      headerName: "Evaluator SapId",
      flex: 1,
    },
    {
      field: "dateofexam",
      headerName: "Date Of Examination",
      flex: 1,
    },
    {
      field: "evaluationMode",
      headerName: "Evaluation Mode",
      flex: 1,
    },
    {
      field: "subjectName",
      headerName: "Subject Name",
      flex: 1,
    },
    {
      field: "subjectCode",
      headerName: "Subject Code",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Bundles
        </Button>
      </Box>
      <UploadBundleModal open={open} onClose={handleClose} />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={cols} pageSize={5} />
      </div>
    </div>
  );
};
export default CopyDistribution;
