// file:    goldBinance.tsx

import React, { useEffect, useRef } from "react";
import axios from "axios";

import {
  createChart,
  CandlestickSeries,
} from "lightweight-charts";

 import type {
    IChartApi,
    ISeriesApi,
    CandlestickData,
    UTCTimestamp,
 } from "lightweight-charts";

  const GoldChartLive: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create chart
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 280, // 500
   
      layout: {
        background: { color: "#0f172a" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      timeScale: {
        timeVisible: true,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      borderVisible: false,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // ------------------------
    // 1️⃣ Load historical data
    // ------------------------
    axios
      .get(
        "https://fapi.binance.com/fapi/v1/klines?symbol=XAUUSDT&interval=1m&limit=200"
      )
      .then((res) => {
        const candles: CandlestickData[] = res.data.map(
          (d: any[]) => ({
            time: (d[0] / 1000) as UTCTimestamp,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          })
        );

        series.setData(candles);
      });

    // ------------------------
    // 2️⃣ Attach WebSocket
    // ------------------------
    const socket = new WebSocket(
      "wss://fstream.binance.com/ws/xauusdt@kline_1m"
    );

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      const k = message.k;

      const liveCandle: CandlestickData = {
        time: (k.t / 1000) as UTCTimestamp,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      };

      // update current candle
      series.update(liveCandle);
    };

    socketRef.current = socket;

    // ------------------------
    // Resize handling
    // ------------------------
    const handleResize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({
        width: containerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close();
      chart.remove();
    };
  }, []);

  return <div ref={containerRef} 
  // style={{ width: "930px" }}


  style={{
            width: "930px",
            borderRadius: "6px",
            overflow: "hidden",
        }}
  
  />;   // ORIG: width: "100%"
};

export default GoldChartLive;
