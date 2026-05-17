 // file:    src/components/mnunReview/okTradeSimulation.tsx

import React, { useEffect, useRef } from "react";
import { 
  createChart,
  CandlestickSeries         // new v5 API
} from "lightweight-charts";

import type {
  CandlestickData,
  UTCTimestamp,
} from "lightweight-charts";

import type {
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";

const nextTime = (t: UTCTimestamp, seconds: number) =>
  (t + seconds) as UTCTimestamp;

const CandlestickChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);


  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart: IChartApi = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
            background: { color: "#111" },
            textColor: "#DDD",
        },
        grid: {
            vertLines: { color: "#333" },
            horzLines: { color: "#333" },
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: true,
        },
        });

    // Chart Setup (v5 Compatible)
    const candlestickSeries: ISeriesApi<"Candlestick"> =
        chart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
    });


    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Initial data
    const initialData: CandlestickData[] = generateInitialData();
    candlestickSeries.setData(initialData);

    // Simulate live data
    const interval = setInterval(() => {
      const last = initialData[initialData.length - 1];
      const newCandle = generateNextCandle(last);
      initialData.push(newCandle);
      candlestickSeries.update(newCandle);
    }, 1000);

    return () => {
      clearInterval(interval);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} />;
};

export default CandlestickChart;

/* ------------------- MOCK DATA ------------------- */

function generateInitialData(): CandlestickData[] {
  const data: CandlestickData[] = [];
  let time = (Math.floor(Date.now() / 1000) - 60 * 20) as UTCTimestamp;
  let price = 100;

  for (let i = 0; i < 20; i++) {
    const candle = randomCandle(time, price);
    data.push(candle);
    price = candle.close;
    time = nextTime(time, 60);
  }
  return data;
}


function generateNextCandle(last: CandlestickData): CandlestickData {
  return randomCandle(nextTime(last.time as UTCTimestamp, 60), last.close);
}


function randomCandle(time: UTCTimestamp, basePrice: number): CandlestickData {
  const open = basePrice;
  const close = open + (Math.random() - 0.5) * 4;
  const high = Math.max(open, close) + Math.random() * 2;
  const low = Math.min(open, close) - Math.random() * 2;

  return { time, open, high, low, close };
}
