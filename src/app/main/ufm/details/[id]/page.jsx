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

  const ufmData = getUFMByIdQuery.data?.ufm;
  const ufmByData = ufmData?.UFM_by || {};
  const studentData = ufmData?.student || {};

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
          <Typography variant="body2" color="primary" sx={{ mb: 2, mt: 2 }}>
            Incriminating Material
          </Typography>
          <Grid container sx={1}>
            {ufmData.incriminating_material.communication_devices > 0 && (
              <Grid item xs={3}>
                <Typography variant="body1">
                  Communication Devices:{" "}
                  {ufmData.incriminating_material.communication_devices}
                </Typography>
              </Grid>
            )}

            {ufmData.incriminating_material.handwritten_pages > 0 && (
              <Grid item xs={3}>
                <Typography variant="body1">
                  Handwritten Pages:{" "}
                  {ufmData.incriminating_material.handwritten_pages}
                </Typography>
              </Grid>
            )}

            {ufmData.incriminating_material.printed_pages > 0 && (
              <Grid item xs={3}>
                <Typography variant="body1">
                  Printed Pages: {ufmData.incriminating_material.printed_pages}
                </Typography>
              </Grid>
            )}

            {ufmData.incriminating_material.torn_book_pages > 0 && (
              <Grid item xs={3}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Torn Book Pages:{" "}
                  {ufmData.incriminating_material.torn_book_pages}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid container sx={1}>
            <Grid item xs={6}>
              <Typography variant="body2" color="primary" sx={{ mb: 2, mt: 2 }}>
                New Answer Sheet Number
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {ufmData.new_ans_sheet_number}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" color="primary" sx={{ mb: 2, mt: 2 }}>
                Old Answer Sheet Number
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {ufmData.old_ans_sheet_number || "N/A"}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Student Remarks
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {ufmData.student_remarks}
          </Typography>
        </>
      )}
      <Typography variant="h5" sx={{ mb: 2 }}>
        UFM By
      </Typography>
      <Grid container sx={1}>
        <Grid item xs={3}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Email:
          </Typography>
          <Typography variant="body1">{ufmByData.email || "N/A"}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Name:
          </Typography>
          <Typography variant="body1"> {ufmByData.name || "N/A"}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Phone:
          </Typography>
          <Typography variant="body1"> {ufmByData.phone || "N/A"}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            SAP ID:
          </Typography>
          <Typography variant="body1"> {ufmByData.sap_id || "N/A"}</Typography>
        </Grid>
      </Grid>
      <Typography variant="h5" sx={{ mb: 2, mt: 2 }}>
        Student Details
      </Typography>
      <Grid container sx={1}>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Address:
          </Typography>
          <Typography variant="body1">
            {studentData.address || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Course:
          </Typography>
          <Typography variant="body1">{studentData.course || "N/A"}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Emergency Contact Number:
          </Typography>
          <Typography variant="body1">
            {studentData.emergency_contact || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Exam Type:
          </Typography>
          <Typography variant="body1">
            {studentData.exam_type || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Father&apos;s Name:
          </Typography>
          <Typography variant="body1">
            {studentData.father_name || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Mobile:
          </Typography>
          <Typography variant="body1">{studentData.mobile || "N/A"}</Typography>
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 2 }} spacing={1}>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Name:
          </Typography>
          <Typography variant="body1"> {studentData.name || "N/A"}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Roll_No:
          </Typography>
          <Typography variant="body1">
            {studentData.roll_no || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Sap_id:
          </Typography>
          <Typography variant="body1">{studentData.sap_id || "N/A"}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Seat Number:
          </Typography>
          <Typography variant="body1">
            {studentData.seat_no || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Subject:
          </Typography>
          <Typography variant="body1">
            {studentData.subject || "N/A"}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Subject Code:
          </Typography>
          <Typography variant="body1">
            {studentData.subject_code || "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UFMDetailPage;
