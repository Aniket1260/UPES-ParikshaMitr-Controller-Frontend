"use client";
import { getUFMByIdService } from "@/services/cont-ufm.service";
import { Box, Chip, CircularProgress, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import React from "react";

const UFMDetailPage = ({ params }) => {
  const { id: slotId } = params;

  if (global?.window !== undefined) {
    var controllerToken = localStorage.getItem("token");
  }
  const getUFMByIdQuery = useQuery({
    queryKey: ["ufm", { type: "byId" }, controllerToken, slotId],
    queryFn: () => getUFMByIdService(slotId, controllerToken),
    retry: 2,
    staleTime: 1000,
    gcTime: 1000 * 2,
  });

  if (getUFMByIdQuery.isError) {
    enqueueSnackbar({
      variant: "error",
      message:
        getUFMByIdQuery.error.response?.status +
        " : " +
        getUFMByIdQuery.error.response?.data.message,
    });
  }

  console.log(getUFMByIdQuery.data);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        UFM Detail Page
      </Typography>
      {getUFMByIdQuery.isLoading && <CircularProgress />}
      {getUFMByIdQuery.isSuccess && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="primary">
                Recovered From
              </Typography>
              <Typography variant="h5">
                {Object.keys(getUFMByIdQuery.data.ufm?.recovered_from).map(
                  (key) => {
                    // return (
                    //   <p>
                    //     {key},{" "}
                    //     {getUFMByIdQuery.data.ufm?.recovered_from[key]
                    //       ? "Recovered"
                    //       : "Not Recovered"}
                    //   </p>
                    // );
                    if (getUFMByIdQuery.data.ufm?.recovered_from[key]) {
                      return (
                        <Chip
                          label={key
                            .toLowerCase()
                            .replace(/([-_][a-z])/g, (group) =>
                              group
                                .toUpperCase()
                                .replace("-", " ")
                                .replace("_", " ")
                            )
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          sx={{ mr: 1 }}
                          key={key}
                        />
                      );
                    } else {
                      return null;
                    }
                  }
                )}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default UFMDetailPage;
