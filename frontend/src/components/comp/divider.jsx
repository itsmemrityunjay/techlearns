import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { SiCplusplus, SiJava, SiCss3, SiHtml5, SiPython } from "react-icons/si";
import { useNavigate } from "react-router-dom";
// import { SiJava } from 'react-icons/si';
const CourseBanner = () => {

  const Navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f6faff",
        borderRadius: "8px",
        padding: "20px 30px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        marginTop: "30px",
        width: "100%"
      }}
      onClick={() => Navigate("/course")}
    >
      {/* Text Section */}
      <Box>
        <Typography variant="subtitle1" color="textSecondary">
          Stuck somewhere?
        </Typography>
        <Typography
          variant="h4"
          color="textPrimary"
          sx={{ fontWeight: "bold", margin: "10px 0" }}
        >
          Learn from Top Courses
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Upskill, get certified, and stay ahead of the competition with our
          50+ trending courses.
        </Typography>
      </Box>

      {/* Icon Section */}
      <Box
        sx={{
          display: "flex",
          gap: "15px",
        }}
      >
        {/* Individual Icons */}
        <Avatar
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 56,
            height: 56,
          }}
        >
          <SiCplusplus color="#00599C" size={28} />
        </Avatar>
        <Avatar
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 56,
            height: 56,
          }}
        >
          {/* <SiJava color="#007396" size={28} /> */}
        </Avatar>
        <Avatar
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 56,
            height: 56,
          }}
        >
          <SiCss3 color="#264DE4" size={28} />
        </Avatar>
        <Avatar
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 56,
            height: 56,
          }}
        >
          <SiHtml5 color="#E34F26" size={28} />
        </Avatar>
        <Avatar
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            width: 56,
            height: 56,
          }}
        >
          <SiPython color="#3776AB" size={28} />
        </Avatar>
      </Box>
    </Box>
  );
};

export default CourseBanner;
