import React, { useEffect, useRef, useState } from "react";
import { CrosshairMode, createChart } from "lightweight-charts";
import { Box, useTheme } from "@mui/material";
import axiosInstance from "utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { selectTopBarHeight } from "redux/features/app/configSlice";
import createWebSocket from "utils/websocket";
import { reportError } from "redux/features/app/error";
import {
  selectActiveAsset,
  selectKlineInterval,
} from "redux/features/app/appDataSlice";

const CandleStickChart = ({ formWidth }) => {
  const chartContainerRef = useRef(null);
  const resizeObserver = useRef(null);
  const dispatch = useDispatch();

  const klineInterval = useSelector(selectKlineInterval);
  const assetName = useSelector(selectActiveAsset);
  const topBarHeight = useSelector(selectTopBarHeight);
  const theme = useTheme();

  const [chart, setChart] = useState(null);

  const fetchHistoricalData = async (candlestickSeries) => {
    let historicalData;
    try {
      const response = await axiosInstance({
        method: "POST",
        url: "http://localhost:5000/api/v1/app/historical-klines",
        data: {
          assetName,
          klineInterval,
        },
        withCredentials: true,
      });
      historicalData = response.data.payload;
      candlestickSeries.setData(historicalData);
    } catch (error) {
      dispatch(reportError({ message: error.message, type: "error" }));
      return [];
    }
  };

  useEffect(() => {
    const currentChartContainer = chartContainerRef.current;
    if (currentChartContainer) {
      const chartInstance = createChart(chartContainerRef.current, {
        autoSize: true,
        layout: {
          background: {
            color: theme.palette.bgColor.dark,
          },
          textColor: "rgba(255, 255, 255, 0.9)",
        },
        grid: {
          vertLines: {
            color: "#334158",
          },
          horzLines: {
            color: "#334158",
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        priceScale: {
          borderColor: "#485c7b",
        },
        timeScale: {
          visible: false,
          borderColor: "#485c7b",
        },
      });

      setChart(chartInstance);

      resizeObserver.current = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        chartInstance.applyOptions({ width, height });
      });
      resizeObserver.current.observe(currentChartContainer);

      chartInstance.timeScale().scrollToPosition(5, true);

      const candlestickSeries = chartInstance.addCandlestickSeries({
        upColor: "#4bffb5",
        downColor: "#ff4976",
        borderDownColor: "#ff4976",
        borderUpColor: "#4bffb5",
        wickDownColor: "#838ca1",
        wickUpColor: "#838ca1",
      });

      fetchHistoricalData(candlestickSeries);

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
          assetName,
          klineInterval,
        });

        socket.on("klineData", (data) => {
          candlestickSeries.update(data.candlestick);
        });
      });
      return () => {
        currentChartContainer && (currentChartContainer.innerHTML = "");
        resizeObserver.current && resizeObserver.current.disconnect();
        socket && socket.close();
      };
    }
  }, [assetName, klineInterval]);

  useEffect(() => {
    return () => {
      chart && chart.remove();
    };
  }, [chart]);
  return (
    <Box
      ref={chartContainerRef}
      sx={{
        width: {
          xs: "100vw",
          sm: `calc(100vw - ${formWidth})`,
        },
        height: `calc(100vh - 7rem - ${topBarHeight})`,
        margin: "0",
        padding: "0",
      }}
    ></Box>
  );
};

export default CandleStickChart;
