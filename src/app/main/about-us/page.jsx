import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const cardStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Aniruddh Upadhyay",
      role: "Assoc Product Developer",
      company: "BMC Software Pvt. Ltd.",
      spec: "BTech CSE AIML B3 HONORS",
      image: "/Ani.jpg",
      phone: "7999928830",
      email: "aniruddh622003@gmail.com",
    },
    {
      name: "Khushi Gupta",
      role: "Technical Associate",
      company: "OnceHub Technologies Pvt. Ltd.",
      spec: "BTech CSE AIML B3 NON-HONORS",
      image: "/Ani.jpg",
      phone: "7078870401",
      email: "500086849@stu.upes.ac.in",
    },
    {
      name: "Aarav Sharma",
      role: "Business Analyst",
      company: "Barclays Bank PLC",
      spec: "BTech CSE AIML B3 HONORS",
      image: "/Aarav.jpeg",
      phone: "9810365071",
      email: "mailaarav2002@gmail.com",
    },
    {
      name: "Eshaan Dutta",
      role: "Software Developer",
      company: "Tata Technologies",
      spec: "BTech CSE AIML B3 HONORS",
      image: "/Rishi.jpeg",
      phone: "9413766488",
      email: "eshandutta06@gmail.com",
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography sx={{ textAlign: "center" }} variant="h4" component="h2">
          Project Mentor
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}></Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant="h5" component="h2">
              Virender Kadyan
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Associate Professor
            </Typography>
            <Typography variant="body2" component="p">
              University of Petroleum and Energy Studies
            </Typography>
            <Typography variant="body2" component="p">
              Head Research Labs: SLRC, MiRC
            </Typography>
            <Typography variant="body2" component="p">
              Coordinator-Centre-Data Science and A.I.
            </Typography>
            <Typography variant="body2" component="p">
              9992037007
            </Typography>
            <Typography variant="body2" component="p">
              vkadyan@ddn.upes.ac.in
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Typography sx={{ textAlign: "center" }} variant="h4" component="h2">
          Team Members
        </Typography>
      </Grid>
      {teamMembers.map((member, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card style={cardStyle}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {member.name}
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 0, lineHeight: 1 }}>
                {member.role}
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
                sx={{ mb: 2 }}
              >
                {member.company}
              </Typography>
              <Typography variant="body2" component="p">
                B-Tech Hons. CSE AIML (UPES)
              </Typography>
              <Typography variant="body2" component="p">
                {member.phone}
              </Typography>
              <Typography variant="body2" component="p">
                {member.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AboutUs;
