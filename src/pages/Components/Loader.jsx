import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Loader = () => {
  const fancyTexts = [
    "Checking vehicle flow",
    "Counting every axle and cent",
    "Crunching kilometers into currency",
    "Converting cars into cash",
    "Reading toll tapes",
    "Vehicles passing, profits rising",
    "Waiting for the traffic to pay up",
    "Assembling toll intelligence",
  ];

  const [loadingText, setLoadingText] = useState("Loading");
  useEffect(() => {
    try {
      if (!Array.isArray(fancyTexts) || fancyTexts.length === 0) {
        setLoadingText("Loading");
      }
      const randomIndex = Math.floor(Math.random() * fancyTexts.length);
      setLoadingText(fancyTexts[randomIndex] || "Loading");
    } catch {
      setLoadingText("Loading");
    }
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        flexDirection: "column",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src="/images/MINT-Loader.gif" alt="MINT" width={180} />
      <Typography
        sx={{
          mt: 2,
        }}
      >
        {loadingText}...
      </Typography>
    </Box>
  );
};

export default Loader;
