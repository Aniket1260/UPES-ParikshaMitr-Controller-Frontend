"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

import { useQueryClient } from "@tanstack/react-query";
import UploadBundleModal from "./UploadBundleModal";

const CopyDistribution = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        Upload CSV
      </Button>
      <UploadBundleModal open={open} onClose={handleClose} />
    </div>
  );
};
export default CopyDistribution;
