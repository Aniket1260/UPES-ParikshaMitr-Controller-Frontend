"use client";
import {
  EditSlotContacts,
  getSlotContacts,
} from "@/services/exam-slots.service";
import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";

const ContactModal = ({ open, handleClose, slot_id }) => {
  const [contacts, setContact] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [addContact, setAddContact] = React.useState({
    open: false,
    name: "",
    phone: "",
  });

  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }
  useEffect(() => {
    if (slot_id) {
      setIsLoading(true);
      getSlotContacts(controllerToken, slot_id)
        .then((data) => {
          setContact(
            data?.data?.map((ele, idx) => ({
              ...ele,
              id: idx,
              phone: parseInt(ele.phone),
            }))
          );
          setIsLoading(false);
        })
        .catch((error) => {
          enqueueSnackbar({
            variant: "error",
            message: error.message,
          });
          setIsLoading(false);
        });
    }
  }, [slot_id, controllerToken]);

  const { mutate } = useMutation({
    mutationFn: () => EditSlotContacts(controllerToken, { slot_id, contacts }),
    onSuccess: () => {
      enqueueSnackbar({
        variant: "success",
        message: "Contacts Saved Successfully",
      });
      handleClose();
    },
    onError: (error) => {
      enqueueSnackbar({
        variant: "error",
        message: error.message,
      });
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Slot Contacts</DialogTitle>
      <DialogContent
        sx={{
          minWidth: "400px",
        }}
      >
        {isLoading && <div>Loading...</div>}
        {contacts.length > 0 &&
          contacts.map((contact) => (
            <ContactCard
              contact={contact}
              key={contact.id}
              deleteContact={(id) => {
                setContact(contacts.filter((ele) => ele.id !== id));
              }}
            />
          ))}
        <AddContact
          open={addContact.open}
          handleClose={() => setAddContact({ open: false })}
          name={addContact.name}
          setName={(nm) => setAddContact((prev) => ({ ...prev, name: nm }))}
          phone={addContact.phone}
          setPhone={(ph) => setAddContact((prev) => ({ ...prev, phone: ph }))}
          confirm={() => {
            setContact([
              ...contacts,
              {
                name: addContact.name,
                phone: addContact.phone,
                id: contacts.length,
              },
            ]);
            setAddContact({ open: false, name: "", phone: "" });
            console.log(contacts);
          }}
        />
        <Button
          sx={{ width: "100%" }}
          variant="outlined"
          onClick={() => setAddContact({ open: true })}
        >
          Add New Contact
        </Button>

        <Box sx={{ display: "flex", justifyContent: "end", mt: 2, gap: 2 }}>
          <Button color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              mutate();
            }}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

const ContactCard = ({ contact, deleteContact }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 5,
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h6">{contact.name}</Typography>
        <Typography variant="body1">{contact.phone}</Typography>
      </Box>
      <Box>
        <IconButton onClick={() => deleteContact(contact.id)}>
          <Delete />
        </IconButton>
      </Box>
    </Box>
  );
};

const AddContact = ({
  open,
  handleClose,
  name,
  setName,
  phone,
  setPhone,
  confirm,
}) => {
  if (!open) return null;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mb: 2,
      }}
    >
      <Typography variant="h6">Add New Contact</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(parseInt(e.target.value))}
          type="number"
        />
      </Box>
      <Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClose}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={() => confirm()}>
          Add
        </Button>
      </Box>
    </Box>
  );
};
