
// file:        bitcoinBinance.tsx
// remarks:     Use Binance REST first
//              Use Binance WebSocket

import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns"; // ✅ date adapter
import axios from "axios";

Chart.register(CandlestickController, CandlestickElement);

interface CandlestickChartProps {
  symbol?: string;
  interval?: string;
}

interface CandlestickDataPoint {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
    symbol = "BTCUSDT",
    interval = "1m",
 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // BTC price
  const [price, setPrice] = useState<number | null>(null);
  const prevPriceRef = useRef<number | null>(null);

  // FIX Color Soln
  const getCandleColor = (d: CandlestickDataPoint) =>
  d.c > d.o ? "#4bffb5" : d.c < d.o ? "#ff4976" : "#999";

  useEffect(() => {
    let isMounted = true;

    const fetchCandles = async () => {
      const res = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
      );

      const data: CandlestickDataPoint[] = res.data.map((c: any) => ({
        x: c[0],
        o: parseFloat(c[1]),
        h: parseFloat(c[2]),
        l: parseFloat(c[3]),
        c: parseFloat(c[4]),
      }));

      // BTC price
       if (data.length > 0) {
            setPrice(data[data.length - 1].c);
        }

      if (!isMounted) return;

      if (!chartRef.current && canvasRef.current) {
        chartRef.current = new Chart(canvasRef.current, {
          type: "candlestick",

          data: {
            datasets: [
              {
                label: `${symbol} Trend`,
                data,
                borderColor: (ctx) => getCandleColor(ctx.raw as CandlestickDataPoint),
                backgroundColor: (ctx) => getCandleColor(ctx.raw as CandlestickDataPoint),   
              },
            ],
          },


          options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: false,

              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: "hour",
                  },
                  offset: true,
                  ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6,
                  },
                },

                y: {
                  beginAtZero: false,
                },
              },


              plugins: {
                legend: {
                  display: false,
                },

                datalabels: {
                  display: false,
                },
              },

              
          },

        });
      }
      startWebSocket();
    };

    const startWebSocket = () => {
      const wsSymbol = symbol.toLowerCase();
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${wsSymbol}@kline_${interval}`
      );

      socketRef.current = ws;

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const k = message.k;

        const newCandle: CandlestickDataPoint = {
          x: k.t,
          o: parseFloat(k.o),
          h: parseFloat(k.h),
          l: parseFloat(k.l),
          c: parseFloat(k.c),
        };

        const newPrice = parseFloat(k.c);
      
        setPrice((current) => {
            prevPriceRef.current = current;
            return newPrice;
        });

        if (!chartRef.current) return;

        const dataset = chartRef.current.data.datasets[0];
        const data = dataset.data as CandlestickDataPoint[];

        const last = data[data.length - 1];

        if (last && last.x === newCandle.x) {
          // Update current candle
          data[data.length - 1] = newCandle;
        } else {
          // Push new candle
          data.push(newCandle);

          // Keep max 100 candles
          if (data.length > 100) {
            data.shift();
          }
        }

        chartRef.current.update("none");
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };


    fetchCandles();

    return () => {
      isMounted = false;

      if (socketRef.current) {
        socketRef.current.close();
      }

      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };

  }, [symbol, interval]);


  return (
    <div 
        style={{
        width: "500px",
        height: "280px",   
        position: "relative",
        background: "none",
       
        
        }}>
            <div
                style={{
                    fontSize: "14px",
                    fontWeight: "normal" ,
                    marginBottom: "10px",
                }}>
                BINANCE BTCUSDT:{" "}
                <span
                    style={{
                    color:
                        prevPriceRef.current !== null && price !== null
                        ? price > prevPriceRef.current
                            ? "#00c853"
                            : price < prevPriceRef.current
                            ? "#d50000"
                            : "#000"
                        : "#000",
                    transition: "color 0.2s ease",
                    }}
                >
                    {price ? `$${price.toLocaleString()}` : "Loading..."}
                </span>
            </div>

        <div
              style={{
                position: "relative",
                width: "500px",
                height: "240px",
              }}
            >
              <canvas ref={canvasRef} />
        </div>

    </div>
  )
};

export default CandlestickChart;


