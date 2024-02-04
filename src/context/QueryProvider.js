"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import React, { useState } from "react";

const QueryProvider = ({ children }) => {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {children}
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
