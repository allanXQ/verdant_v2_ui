import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import CandleStickChart from "./chart";
import RangePicker from "./rangePicker";
import { Buy, Sell } from "./modals/trade";
import { selectTheme } from "redux/features/app/configSlice";
import { useSelector } from "react-redux";
import { MuiButton } from "components/common/Button";
import { useNavigate } from "react-router-dom";

const MainChart = () => {
  const theme = useTheme();
  const currentTheme = useSelector(selectTheme);
  const navigate = useNavigate();
  const mediaQuery = useMediaQuery(theme.breakpoints.down("md"));
  const formWidth = mediaQuery ? 0 : "17rem";

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",

        backgroundColor:
          currentTheme === "light"
            ? theme.palette.bgColor.light
            : theme.palette.bgColor.dark,
        width: "100vw",
        gap: mediaQuery ? 2 : 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <RangePicker formWidth={formWidth} />
        <CandleStickChart formWidth={formWidth} />
      </Box>

      <Box
        sx={{
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: { xs: "100vw", md: `calc(${formWidth})` },
        }}
      >
        <MuiButton
          variant="contained"
          content="Trade History"
          sx={{
            width: "15rem",
          }}
          onClick={() => navigate("/history/spot")}
        />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: { xs: "row", md: "column" },
          }}
        >
          <Buy />
          <Sell />
        </Box>
      </Box>
    </Box>
  );
};

export default MainChart;
