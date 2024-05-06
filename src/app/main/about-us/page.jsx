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
      sapid: "500086707",
      rollNo: "R2142201678",
      spec: "BTech CSE AIML B3 HONORS",
      image: "/Ani.jpg",
      phone: "7999928830",
      email: "500086707@stu.upes.ac.in",
    },
    {
      name: "Khushi Gupta",
      sapid: "500086849",
      rollNo: "R2142201726",
      spec: "BTech CSE AIML B3 NON-HONORS",
      image: "/Ani.jpg",
      phone: "7078870401",
      email: "500086849@stu.upes.ac.in",
    },
    {
      name: "Aarav Sharma",
      sapid: "500086653",
      rollNo: "R2124201639",
      spec: "BTech CSE AIML B3 HONORS",
      image: "/Aarav.jpeg",
      phone: "9810365071",
      email: "500086653@stu.upes.ac.in",
    },
    {
      name: "Eshaan Dutta",
      sapid: "500082336",
      rollNo: "R2142201672",
      spec: "BTech CSE AIML B3 HONORS",
      image: "/Rishi.jpeg",
      phone: "8130265254",
      email: "500082336@stu.upes.ac.in",
    },
  ];

  return (
    <Grid container spacing={3}>
      {teamMembers.map((member, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card style={cardStyle}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {member.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {member.sapid}
              </Typography>
              <Typography variant="body2" component="p">
                {member.rollNo}
              </Typography>
              <Typography variant="body2" component="p">
                {member.spec}
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
