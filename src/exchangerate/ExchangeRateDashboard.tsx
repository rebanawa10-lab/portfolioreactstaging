


// file:    C:\Repos\PortfolioStaging\React\src\exchangerate\ExchangeRateDashboard.tsx


import React, { useState } from "react";

import ExchangeRateChartMaster
    from "./ExchangeRateChartMaster";   

import type { PeriodOption } from "./exchangeRateTypes";

 {/* DEBUG MODE: Hide Exchange Rate Smry */}
// import ExchangeSMRY from "./exchangeRateSMRY";


import MyForexTicker from "./exchangeRateForexTicker";


// ==========================================
// MAIN SCREEN
// ==========================================

const ExchangeRateDashboard: React.FC = () => {

    // Default = 1 Year
    const [period, setPeriod] =
        useState<PeriodOption>("1Y");


    return (

        <div
            style={{
                padding: "20px"
            }}
        >

            {/* ======================================
                HEADER
            ====================================== */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "20px"
                }}
            >

                <h2
                    style={{
                        margin: 0
                    }}
                >
                    Exchange Rate
                </h2>


                {/* ==================================
                    PERIOD
                ================================== */}

                <select
                    value={period}
                    onChange={(e) => {
                        setPeriod(e.target.value as PeriodOption);
                    }}
                    style={{
                        padding: "7px 12px",
                        fontSize: "14px"
                    }}
                >
                    <option value="6M">6 Months</option>
                    <option value="1Y">1 Year</option>
                    <option value="2Y">2 Years</option>
                    <option value="ALL">All Data</option>
                </select>

            </div>


            {/* ======================================
                CHART GRID
            ====================================== */}
         
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: "10px",
                    rowGap: "10px",
                    width: "1000px"
                }}
            >

                {/* MY */}

                <div>
                    <ExchangeRateChartMaster
                        currency="MY"
                        period={period}
                    />
                </div>


                {/* PH */}

                <div>
                    <ExchangeRateChartMaster
                        currency="PH"
                        period={period}
                    />
                </div>


                {/* US */}

                <div>
                    <ExchangeRateChartMaster
                        currency="US"
                        period={period}
                    />
                </div>


                {/* Smry */}

                <div>

                    {/* DEBUG MODE: Hide Exchange Rate Smry */}

                    {/* <div style={styles.gridContainer}>
                        <div style={styles.gridItem}>                       
                            <h4 style={{ marginTop: "2px" }}>
                                Rates Today (Base: SGD)
                            </h4>
                            
                            <ExchangeSMRY />  
                        </div>

                    </div> */}

                     <div className="forex-row">
                        <br></br> 
                        <MyForexTicker />
                    </div>


                </div>

            </div>

        </div>

    );

};

{/* DEBUG MODE: Hide Exchange Rate Smry */}

// const styles: { [key: string]: React.CSSProperties } = {
  
//       gridContainer: {
//       display: "grid",
//       width: "580px",
//       gridTemplateColumns: "repeat(2, 460px)", // fixed smaller width
//       gap: "12px",
     
//       justifyContent: "left",
//       },

//       gridItem: {
//       background: "#f5f5f5",
//       borderRadius: "6px",
//       width: "580px",
//       padding: "2px",          // smaller padding
//       paddingBottom: "12px",
//       boxShadow: "0px 1px 4px rgba(0,0,0,0.08)", // lighter shadow
//       },

// };




export default ExchangeRateDashboard;
