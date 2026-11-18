


// file: C:\Repos\PortfolioStaging\React\src\components\mnuinfo\dashboard\goldBinancePrice.tsx

import React, {
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";


import { log } from "../../../../src/config/debug";


const GoldPrice: React.FC = () => {

    const [price, setPrice] =
        useState<number | null>(null);

    const [color, setColor] =
        useState<string>("#ffffff");

    const previousPrice =
        useRef<number | null>(null);


    // ==========================================
    // UPDATE PRICE
    // ==========================================

    const updatePrice = (newPrice: number) => {

        if (!Number.isFinite(newPrice)) {
            return;
        }


        if (previousPrice.current !== null) {

            if (
                newPrice >
                previousPrice.current
            ) {

                setColor("#26a69a");

            }
            else if (
                newPrice <
                previousPrice.current
            ) {

                setColor("#ef5350");

            }

        }


        previousPrice.current =
            newPrice;

        setPrice(newPrice);

    };


    useEffect(() => {

        // ======================================
        // 1. GET INITIAL PRICE
        // ======================================

        const loadInitialPrice =
            async () => {

                try {

                    const response =
                        await axios.get(
                            "https://fapi.binance.com/fapi/v1/ticker/price?symbol=XAUUSDT"
                        );


                    log(
                        "Initial Gold Price:",
                        response.data
                    );


                    const newPrice =
                        Number(
                            response.data.price
                        );


                    updatePrice(newPrice);

                }
                catch (error) {

                    console.error(
                        "Initial Gold REST API error:",
                        error
                    );

                }

            };


        loadInitialPrice();


        // ======================================
        // 2. WEBSOCKET
        // ======================================

        const socket =
            new WebSocket(
                "wss://fstream.binance.com/ws/xauusdt@ticker"
            );


        socket.onopen = () => {

            log(
                "Gold WebSocket connected"
            );

        };


        socket.onmessage =
            (event) => {

                try {

                    const data =
                        JSON.parse(
                            event.data
                        );


                    log(
                        "Gold WebSocket:",
                        data
                    );


                    const newPrice =
                        Number(data.c);


                    updatePrice(newPrice);

                }
                catch (error) {

                    console.error(
                        "Gold WebSocket parse error:",
                        error
                    );

                }

            };


        socket.onerror =
            (error) => {

                console.error(
                    "Gold WebSocket error:",
                    error
                );

            };


        socket.onclose =
            (event) => {

                log(
                    "Gold WebSocket closed:",
                    event.code,
                    event.reason
                );

            };


        // ======================================
        // CLEANUP
        // ======================================

        return () => {

            socket.close();

        };

    }, []);


    // ==========================================
    // DISPLAY
    // ==========================================

    return (

        <div
            style={{
                background: "#0f172a",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "normal",
                width: "170px",
            }}
        >

            <div
                style={{
                    fontSize: "16px",
                    opacity: 0.7
                }}
            >
                Gold (XAUUSDT)
            </div>


            <div
                style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginTop: "10px",
                    color: color,
                    transition:
                        "color 0.2s ease",
                }}
            >

                {price !== null
                    ? `$${price.toFixed(2)}`
                    : "Loading..."
                }

            </div>

        </div>

    );

};


export default GoldPrice;