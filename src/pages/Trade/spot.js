import { Box } from "@mui/material";
import MainChart from "components/trade/chart";
import React from "react";

const Trade = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        backgroundColor: "#253248",
        margin: "0",
        padding: "0",
      }}
    >
      <MainChart />
    </Box>
  );
};

export default Trade;
