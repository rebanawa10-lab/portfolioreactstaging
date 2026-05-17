// file: ForexTicker.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./forexticker";

import { log } from "../../../config/debug";

type Rates = {
  [key: string]: number;
};

const ForexTicker: React.FC = () => {
  const [rates, setRates] = useState<Rates>({});
  const [loading, setLoading] = useState(true);

  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [nextUpdate, setNextUpdate] = useState<string>("");

  const [isPaused, setIsPaused] = useState(false);

  const fetchRates = async () => {
        try {
                const response = await axios.get(   
                    "https://open.er-api.com/v6/latest/USD"
                );
                // Data:        ALL content 
                // Provider:    https://www.exchangerate-api.com
                // Debug:       log(response.data); //  check what API returns
                log("Axios Response loaded")
                     

                if (response.data && response.data.rates) {
                    setRates(response.data.rates);
                } else {
                    console.error("Rates not found in response");
                    setRates({});
                }

                if (response.data.result === "success") {
                    setRates(response.data.rates);
                    setLastUpdate(response.data.time_last_update_utc);
                    setNextUpdate(response.data.time_next_update_utc);
                }
                setLoading(false);
        } catch (error) {
                console.error("Error fetching forex rates:", error);
                setLoading(false);
        }
  };

  useEffect(() => {
        fetchRates();

        // Refresh every 10 seconds
        // const interval = setInterval(fetchRates, 10000);
        // return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading forex rates...</div>;

  if (!rates) return <div>No data available</div>;


 // Show only selected currencies
  const selected = ["USD", "EUR", "GBP", "JPY", "AUD", "SGD", "MYR", "PHP", "THB"];

  return (
    <div>

            {/* Ref: ALL content */}                       
            {/* <div style={{ display: "flex", gap: "20px" }}>
            {Object.entries(rates).map(([currency, rate]) => (
                <div key={currency} style={{ fontWeight: "bold" }}>
                {currency}: {rate.toFixed(4)}
                </div>
            ))}
            </div> */}


            <div
            style={{

                width: "100%",
                maxWidth: "700px",
                margin: "0 auto",

                
                overflow: "hidden",
                background: "#3a5070",
                color: "white",
                padding: "4px 0",          
            }}
            onMouseOver={() => setIsPaused(true)}
            onMouseOut={() => setIsPaused(false)}
            >
               {/* background: "#111", 
               width: "700px",
               */}

                <div
                    style={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    animation: "scroll 20s linear infinite",

                    animationPlayState: isPaused ? "paused" : "running",

                    alignItems: "center"

                    }}
                >
                    {[...selected, ...selected].map((currency, index) => (
                    <span
                        key={index}
                        style={{ marginRight: "15px", fontSize: "13px"}}
                    >
                        {currency}: {rates[currency]?.toFixed(4)}
                    </span>                 

                    ))}
                </div>

                <style>
                    {`
                    @keyframes scroll {
                        from { transform: translateX(0); }
                        to { transform: translateX(-50%); }
                    }
                    `}
                </style>

            </div>

            <div style={{ marginBottom: "5px", fontSize: "12px", color: "gray", textAlign: "center"}}>
                NOTE: Exchange rate Last Update (UTC): {lastUpdate.replace(" +0000"," ")}  * 
                Next Update (UTC): {nextUpdate.replace(" +0000"," ")}
            </div>
      </div>

  );
};

export default ForexTicker;
