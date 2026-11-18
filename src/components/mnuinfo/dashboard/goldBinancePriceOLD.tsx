// file:    goldBinancePriceOLD.tsx

import React, { useEffect, useRef, useState } from "react";
// import React, { useEffect, useState, useRef } from "react";

  const GoldPrice: React.FC = () => {
      
      const [price, setPrice] = useState<number | null>(null);
      const [color, setColor] = useState<string>("#ffffff");
      const previousPrice = useRef<number | null>(null);

      useEffect(() => {
          const socket = new WebSocket(
            "wss://fstream.binance.com/ws/xauusdt@ticker"
          );

          socket.onopen = () => {

              console.log(
                  "Binance Gold WebSocket connected"
              );

          };

          socket.onmessage = (event) => {

              try {
                    const data = JSON.parse(event.data);
                            console.log(
                                  "Binance Gold:",
                                  data
                              );
                    const newPrice = parseFloat(data.c);

                              if (!Number.isFinite(newPrice)) {

                                  console.error(
                                      "Invalid gold price:",
                                      data
                                  );

                                  return;

                              }

                      if (previousPrice.current !== null) {
                        if (newPrice > previousPrice.current) {
                          setColor("#26a69a"); // green
                        } else if (newPrice < previousPrice.current) {
                          setColor("#ef5350"); // red
                        }
                      }

                    previousPrice.current = newPrice;  
                    setPrice(parseFloat(data.c));
              }
              catch (error) {
                    console.error(
                        "Binance message error:",
                        error
                    );
              }

          };

          socket.onerror = (error) => {
              console.error(
                  "Binance WebSocket error:",
                  error
              );
          };


          socket.onclose = (event) => {
              console.log(
                  "Binance WebSocket closed:",
                  event.code,
                  event.reason
              );
          };
          return () => {
            socket.close();
          };

  }, []);


  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "6px",
        textAlign: "center",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "normal",
        width: "170px",
      }}
    >
     
      <div style={{ fontSize: "16px", opacity: 0.7 }}>
          Gold (XAUUSDT)
      </div>

      {/* <div style={{ fontSize: "16px", marginTop: "10px", color: "#26a69a" }}> */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          marginTop: "10px",
          color: color,
          transition: "color 0.2s ease",
        }}
      >
        {/* {price ? `$${price.toFixed(2)}` : "Loading..."} */}

        {price !== null
          ? `$${price.toFixed(2)}`
          : "Loading..."
      }

      </div>
    </div>
  );
};

export default GoldPrice;
