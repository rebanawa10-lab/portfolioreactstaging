 // file:    src/components/mnunReview/okgoldtwelvedata.tsx


import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

import { log } from "../../../src/config/debug";

type GoldPoint = {
  time: string;
  price: number;
};

const GoldMiniChart: React.FC = () => {
  const [data, setData] = useState<GoldPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const apiKey = import.meta.env.GOLD_KEY;

  log("apiKey:" + apiKey);

    // https://api.twelvedata.com/price?symbol=XAU/USD&apikey=a75ea28059e34bb68296def06683a213
  const fetchGold = async () => {
    try {
      const res = await axios.get(
        `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=a75ea28059e34bb68296def06683a213`
      );

      const price = parseFloat(res.data.price);

      if (isNaN(price)) {
      console.warn("Invalid price received from API:", res.data.price);
      return;
     }


      const time = new Date().toLocaleTimeString();

      setCurrentPrice(price);
      setLastUpdated(time);

      setData((prev) => {
        const updated = [...prev, { time, price }];
        return updated.slice(-20);
      });
    } catch (error) {
      console.error("Gold fetch error:", error);
    }
  };

  useEffect(() => {
    fetchGold();
    const interval = setInterval(fetchGold, 60000);
    return () => clearInterval(interval);
  }, []);

  const isUp =
    data.length > 1 &&
    data[data.length - 1].price > data[data.length - 2].price;

  return (
    <div>

        Data retrieved with API parameter <br></br><br></br>
        <div style={styles.card}>
              <h4 style={styles.title}>Gold (XAU/USD)</h4>

              <div style={styles.priceRow}>
                <span style={styles.price}>
                  {currentPrice !== null ? `$${currentPrice.toFixed(2)}` : "Loading…"}
                </span>
                {currentPrice !== null && (
                  <span style={{ color: isUp ? "green" : "red" }}>
                    {isUp ? "▲" : "▼"}
                  </span>
                )}
              </div>
                
                
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={data}>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isUp ? "#2ecc71" : "#e74c3c"}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div style={styles.update}>Last Updated: {lastUpdated}</div>
        </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: { width: 260, padding: 14, borderRadius: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", background: "#fff" },
  title: { margin: 0, fontSize: 14, color: "#555" },
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0" },
  price: { fontSize: 20, fontWeight: "bold", color: "#d4af37" },
  update: { fontSize: 11, marginTop: 6, opacity: 0.6 },
};

export default GoldMiniChart;
