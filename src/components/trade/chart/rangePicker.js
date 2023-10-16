import { MoreVertOutlined } from "@mui/icons-material";
import {
  Box,
  IconButton,
  MenuItem,
  Popover,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import useAssetsData from "Hooks/useAssets";
import { MuiButton } from "components/common/Button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateActiveAsset,
  updateKlineInterval,
} from "redux/features/app/appDataSlice";
import { selectTheme } from "redux/features/app/configSlice";
import { reportError } from "redux/features/app/error";
import axiosInstance from "utils/axiosInstance";
import createWebSocket from "utils/websocket";

const klineIntervals = [
  {
    value: "1s",
    label: "1s",
  },
  {
    value: "1m",
    label: "1m",
  },
  {
    value: "3m",
    label: "3m",
  },
  {
    value: "5m",
    label: "5m",
    default: true,
  },
  {
    value: "15m",
    label: "15m",
  },
  {
    value: "30m",
    label: "30m",
  },
  {
    value: "1h",
    label: "1h",
    default: true,
    main: true,
  },
  {
    value: "2h",
    label: "2h",
  },
  {
    value: "4h",
    label: "4h",
  },
  {
    value: "6h",
    label: "6h",
  },
  {
    value: "8h",
    label: "8h",
  },
  {
    value: "12h",
    label: "12h",
  },
  {
    value: "1d",
    label: "1d",
    default: true,
  },
  {
    value: "3d",
    label: "3d",
  },
  {
    value: "1w",
    label: "1w",
  },
  {
    value: "1M",
    label: "1M",
  },
];

const PriceDisplay = ({ price, color }) => {
  const theme = useTheme();
  return (
    <Typography
      variant="h3"
      color={
        color === "green"
          ? theme.palette.green.main
          : color === "red"
          ? theme.palette.red.main
          : theme.typography.h3.color
      }
      sx={{}}
    >
      {Number(price).toLocaleString()}
    </Typography>
  );
};

const RangePicker = ({ formWidth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { activeAsset, assetNames, klineInterval } = useAssetsData(); //,klineIntervals
  const currentTheme = useSelector(selectTheme);
  const theme = useTheme();
  const [tickerData, setTickerData] = useState(null);
  const [price, setPrice] = useState(0);
  const [priceColor, setPriceColor] = useState(null);

  const fetchTickerData = async (activeAsset) => {
    try {
      const response = await axiosInstance({
        method: "POST",
        url: "http://localhost:5000/api/v1/app/ticker-data",
        data: {
          assetName: activeAsset,
        },
        withCredentials: true,
      });
      let tickerData = response.data.payload;
      return tickerData;
    } catch (error) {
      dispatch(reportError({ message: error.message, type: "error" }));
      return [];
    }
  };

  useEffect(() => {
    fetchTickerData(activeAsset).then((data) => {
      setTickerData(data);
      setPrice(data.lastPrice);
    });

    const socket = createWebSocket();
    socket.connect();

    socket.on("connect_error", (error) => {
      dispatch(reportError({ message: error.message, type: "error" }));
      if (error.message === "xhr poll error") {
        socket.close();
      }
    });

    socket.on("connect", () => {
      socket.emit("requestKlines", {
        activeAsset,
        klineInterval,
      });

      let pricedata = 0;

      socket.on("klineData", (data) => {
        const newPrice = data.candlestick.close;
        if (newPrice > pricedata) {
          setPriceColor("green");
        } else if (newPrice < pricedata) {
          setPriceColor("red");
        }
        pricedata = data.candlestick.close;
        setPrice(newPrice);
      });
    });

    return () => {
      socket && socket.close();
    };
  }, [activeAsset, klineInterval]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAssetChange = (event) => {
    dispatch(updateActiveAsset(event.target.value));
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const statsStyle = {
    width: 300,
    display: "flex",
    alignItems: "flex-start",
    // justifyContent: "flex-end",
    gap: 5,
    pr: 2,
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: {
          xs: "100vw",
          sm: `calc(100vw - ${formWidth})`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box>
          <Select
            value={activeAsset}
            onChange={handleAssetChange}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiTypography-root": {
                ...theme.typography.bodyLargeBold,
              },
            }}
          >
            {Array.isArray(assetNames) &&
              assetNames.map((assetName) => (
                <MenuItem
                  key={assetName}
                  value={assetName}
                  sx={{
                    bgcolor: "transparent",
                    "& .MuiList-root": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Typography variant="bodyRegular">
                    {assetName?.toUpperCase()}
                  </Typography>
                </MenuItem>
              ))}
          </Select>
          <IconButton onClick={handleClick}>
            <MoreVertOutlined color="primary" />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            sx={{
              position: "absolute",
              "& .MuiPopover-paper": {
                backgroundColor:
                  currentTheme === "light"
                    ? theme.palette.bgColor.light
                    : theme.palette.bgColor.dark,
                color: "white",
                boxShadow: "none",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                width: 290,
                p: 2,
                m: 0,
              }}
            >
              {klineIntervals.map((interval) => (
                <MuiButton
                  key={interval.label}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    width: "0.5rem",
                    borderRadius: "0",
                  }}
                  content={interval.label}
                  onClick={() => dispatch(updateKlineInterval(interval.value))}
                />
              ))}
            </Box>
          </Popover>
        </Box>
        <PriceDisplay price={price} color={priceColor} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 200,
        }}
      >
        <Box sx={statsStyle}>
          <Stack>
            <Typography variant="bodySmall">24h High</Typography>
            <Typography variant="bodySmallBold">{tickerData?.high}</Typography>
          </Stack>
          <Stack>
            <Typography variant="bodySmall">24h Change</Typography>
            <Typography variant="bodySmallBold">
              {tickerData?.priceChange}
            </Typography>
          </Stack>
        </Box>
        <Box sx={statsStyle}>
          <Stack>
            <Typography variant="bodySmall">24h Low</Typography>
            <Typography variant="bodySmallBold">{tickerData?.low}</Typography>
          </Stack>

          <Stack>
            <Typography variant="bodySmall">24h Volume</Typography>
            <Typography variant="bodySmallBold">
              {tickerData?.volume}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default RangePicker;
