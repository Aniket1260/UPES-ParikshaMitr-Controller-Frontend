import { Search } from "@mui/icons-material";
import { Box, InputAdornment, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";

const UnapprovedTeacherList = ({ teacherData }) => {
  const [search, setSearch] = useState("");

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
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div>
            <button>Approve</button>
            <button>Reject</button>
          </div>
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
