import { controllerToken } from "@/config/temp.config";
import { approveTeacher } from "@/services/cont-teacher.service";
import { Check, Search } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";

const UnapprovedTeacherList = ({ teacherData }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { mutate } = useMutation({
    mutationFn: (id) => approveTeacher(id, controllerToken),
    onSuccess: () => {
      queryClient.invalidateQueries("teachers");
    },
  });

  const rows = useMemo(() => {
    return teacherData.filter((row) => {
      return row.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, teacherData]);

  const cols = [
    // ID should be the array index
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sap_id", headerName: "SAP ID", flex: 1 },
    {
      field: "onboardedAt",
      headerName: "Onboarding Date",
      flex: 1,
      renderCell: (params) => {
        return format(new Date(params.value), "do MMM yyyy");
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        console.log(params);
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
              color: "blue",
            }}
          >
            <Tooltip title="Approve Teacher" placement="top" arrow>
              <IconButton onClick={() => mutate(params.row._id)}>
                <Check />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ my: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <TextField
          placeholder="Search Unapproved Teachers"
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1, minWidth: 300 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      {rows.length === 0 && <p>No unapproved teachers found</p>}
      {rows.length > 0 && (
        <DataGrid
          rows={rows}
          columns={cols}
          disableRowSelectionOnClick
          disableColumnSelector
          disableColumnFilter
          localeText={{ noRowsLabel: "This is a custom message :)" }}
          sx={{ width: "100%" }}
        />
      )}
    </Box>
  );
};

export default UnapprovedTeacherList;
