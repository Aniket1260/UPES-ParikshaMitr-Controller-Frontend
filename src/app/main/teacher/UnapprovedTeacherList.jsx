import { approveTeacher, editTeacher } from "@/services/cont-teacher.service";
import { Check, Edit, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";

const UnapprovedTeacherList = ({ teacherData }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editTeacherModal, setEditTeacherModal] = useState({
    open: false,
    teacher: null,
  });

  let controllerToken;
  useEffect(() => {
    controllerToken = localStorage.getItem("token");
  }, []);

  const { mutate } = useMutation({
    mutationFn: (id) => approveTeacher(id, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Teacher Approved Successfully",
        autoHideDuration: 3000,
      });
      queryClient.invalidateQueries("teachers");
    },
  });

  const { mutate: mutateTeacher } = useMutation({
    mutationFn: (teacher) => editTeacher(teacher._id, teacher, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Teacher Updated Successfully",
        autoHideDuration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["teachers", { type: "unapproved" }],
      });
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
            <Tooltip title="Edit Teacher" placement="top" arrow>
              <IconButton
                onClick={() =>
                  setEditTeacherModal({
                    open: true,
                    teacher: params.row,
                  })
                }
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <EditTeacherModal
        open={editTeacherModal.open}
        teacher={editTeacherModal.teacher}
        handleClose={() => setEditTeacherModal({ open: false, teacher: null })}
        changeTeacher={(teacher) => {
          setEditTeacherModal({ open: true, teacher });
        }}
        submitFn={() => {
          mutateTeacher(editTeacherModal.teacher);
          setEditTeacherModal({ open: false, teacher: null });
        }}
      />
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

const EditTeacherModal = ({
  open,
  teacher,
  handleClose,
  changeTeacher,
  submitFn,
}) => {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Teacher</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Change Teacher Details
          </DialogContentText>
          <TextField
            label="SAP ID"
            fullWidth
            disabled
            value={teacher?.sap_id}
            sx={{ my: 1 }}
          />
          <TextField
            label="Name"
            type="text"
            fullWidth
            value={teacher?.name}
            onChange={(e) =>
              changeTeacher({ ...teacher, name: e.target.value })
            }
            sx={{ my: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitFn}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
