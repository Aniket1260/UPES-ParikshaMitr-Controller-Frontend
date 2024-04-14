"use client";
import React from "react";
import {
  Box,
  Button,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Grid,
} from "@mui/material";

const UFMRedressalForm = () => {
  const handleSubmit = () => {
    console.log("Form submitted");
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        UFM Redressal
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              id="meeting-date"
              label="Meeting held on"
              type="date"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Decision</Typography>
            <RadioGroup row>
              <FormControlLabel
                value="warning"
                control={<Radio />}
                label="Warning Only"
              />
              <FormControlLabel
                value="paper-cancellation"
                control={<Radio />}
                label="Paper Cancellation"
              />
              <FormControlLabel
                value="other-decisions"
                control={<Radio />}
                label="Other Decisions"
              />
            </RadioGroup>
            {/* <div>details here </div> */}
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField id="edc-member-1" label="Name of EDC Member" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="controller"
              label="Controller of Examination or SRE Representative"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField id="chairman-edc" label="Chairman-EDC" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default UFMRedressalForm;
