import {
  ChangePasswordService,
  approveTeacher,
  deleteTeacherService,
  editTeacher,
} from "@/services/cont-teacher.service";
import { Check, Delete, Edit, Password, Search } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import DeleteConfirmationModal from "./deleteConfirmationModal";

const UnapprovedTeacherList = ({ teacherData }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editTeacherModal, setEditTeacherModal] = useState({
    open: false,
    teacher: null,
  });
  const [changePasswordModal, setChangePasswordModal] = useState({
    open: false,
    teacher: null,
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    teacher: null,
  });

  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

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

  const { mutate: deleteTeacher } = useMutation({
    mutationFn: (id) => deleteTeacherService(id, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Teacher Deleted Successfully",
        autoHideDuration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["teachers", { type: "unapproved" }],
      });
    },
  });

  const handleDeleteConfirmation = () => {
    deleteTeacher(deleteConfirmation.teacher);
    setDeleteConfirmation({ open: false, teacher: null });
  };

  const { mutate: changePassword } = useMutation({
    mutationFn: (body) => ChangePasswordService(body, controllerToken),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Password Changed Successfully",
        autoHideDuration: 3000,
      });
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.response?.status + " : " + error.response?.data.message,
        autoHideDuration: 3000,
      });
    },
  });

  const rows = useMemo(() => {
    return teacherData.filter((row) => {
      return row.name.toLowerCase().startsWith(search.toLowerCase());
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
        return format(new Date(params.value), "do MMM yyyy hh:mm a");
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.8,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
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
            <Tooltip title="Delete Teacher" placement="top" arrow>
              <IconButton
                onClick={() => {
                  setDeleteConfirmation({
                    open: true,
                    teacher: params.row._id,
                  });
                }}
              >
                <Delete color="error" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Change Password" placement="top" arrow>
              <IconButton
                onClick={() => {
                  setChangePasswordModal({
                    open: true,
                    teacher: params.row,
                  });
                }}
              >
                <Password />
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
      <ChangePasswordModal
        open={changePasswordModal.open}
        handleClose={() =>
          setChangePasswordModal({ open: false, teacher: null })
        }
        teacher={changePasswordModal.teacher}
        submitFn={(body) => {
          changePassword(body);
          setChangePasswordModal({ open: false, teacher: null });
        }}
      />
      <DeleteConfirmationModal
        open={deleteConfirmation.open}
        handleClose={() =>
          setDeleteConfirmation({ open: false, teacher: null })
        }
        confirmFn={handleDeleteConfirmation}
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
          // disableColumnSelector
          // disableColumnFilter
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
          <Button onClick={submitFn}>Finish</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const ChangePasswordModal = ({ open, handleClose, teacher, submitFn }) => {
  const [pass, setPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    submitFn({ teacher_id: teacher._id, pass: pass });
  };

  useEffect(() => {
    if (pass === rePass) {
      setError("");
      setSubmitEnabled(true);
    } else {
      setError("Passwords do not match");
      setSubmitEnabled(false);
    }
  }, [pass, rePass]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Change Teacher Password for {teacher?.name}
            <Typography variant="caption" color="error" component="p">
              {error}
            </Typography>
          </DialogContentText>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            sx={{ my: 1 }}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <TextField
            label="Re-enter Password"
            type="password"
            fullWidth
            sx={{ my: 1 }}
            value={rePass}
            onChange={(e) => setRePass(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSubmit()} disabled={!submitEnabled}>
            Finish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
