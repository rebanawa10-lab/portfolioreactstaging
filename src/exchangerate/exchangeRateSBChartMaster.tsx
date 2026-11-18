


// file:    C:\Repos\PortfolioStaging\React\src\exchangerate\exchangeRateSBChartMaster.tsx


import React, { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    // Legend
} from "recharts";

import { getExchangeRates } from "./exchangeRateSBAPIservice";

import type { ExchangeRate } from "./exchangeRateSBAPIservice";

import type { PeriodOption }
    from "./exchangeRateTypes";




// ==========================================
// PROPS
// ==========================================

interface ExchangeRateChartMasterProps {

    currency: string;

    period: PeriodOption;

}


// ==========================================
// CHART DATA
// ==========================================

interface ChartData {

    mmmyyyy: string;

    yyyymm: number;

    rate: number;

}


// ==========================================
// Y-AXIS CONFIGURATION
// ==========================================

interface YAxisConfig {

    min: number;

    max: number;

    ticks: number[];

}


// ==========================================
// CURRENCY MAPPING
// ==========================================

const currencyMap: Record<string, string> = {

    MY: "MY",

    PH: "PH",

    US: "US",

    EU: "EU"

};

const currencyDisplayName: Record<string, string> = {

    MY: "SGD - MYR",
    PH: "SGD - PHP",
    US: "SGD - USD",
    EU: "Europe"

};


// ==========================================
// PRE-CONFIGURED CURRENCY AXIS
// ==========================================

const currencyYAxis: Record<
    string,
    YAxisConfig
> = {

    PH: {

        min: 41,

        max: 52,

        ticks: [
            41,
            41.5,
            42,
            42.5,
            43,
            43.5,
            44,
            44.5,
            45,
            45.5,
            46,
            46.5,
            47,
            47.5,
            48,
            48.5,
            49,
            49.5,
            50,
            50.5,
            51,
            51.5,
            52
        ]

    },


    MY: {

        min: 3.0,

        max: 4.0,

        ticks: [
            3.0,
            3.1,
            3.2,
            3.3,
            3.4,
            3.5,
            3.6,
            3.7,
            3.8,
            3.9,
            4.0
          
        ]

    },


    US: {

        min: 0.70,

        max: 0.81,

        ticks: [

            0.70,
            0.71,
            0.72,
            0.73,
            0.74,

            0.75,
            0.76,
            0.77,
            0.78,
            0.79,

            0.80,
            0.81

        ]

    },


    EU: {

        min: 0.8,

        max: 1.2,

        ticks: [
            0.8,
            0.85,
            0.9,
            0.95,
            1.0,
            1.05,
            1.1,
            1.15,
            1.2
        ]

    }

};


// ==========================================
// DEFAULT Y-AXIS
// ==========================================

const defaultYAxis: YAxisConfig = {

    min: 0,

    max: 100,

    ticks: [
        0,
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100
    ]

};


// ==========================================
// COMPONENT
// ==========================================

const ExchangeRateSBChartMaster:
    React.FC<ExchangeRateChartMasterProps> =
    ({
        currency,
        period
    }) => {


    const [allData, setAllData] =
        useState<ChartData[]>([]);


    const [data, setData] =
        useState<ChartData[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState<string | null>(null);


    // ==========================================
    // LOAD API DATA
    // ==========================================

            
        useEffect(() => {

            const loadData = async () => {

                try {

                    setLoading(true);

                    setError(null);


                    // ======================================
                    // LOAD API DATA
                    // ======================================

                    const result: ExchangeRate[] =
                        await getExchangeRates();


                    // ======================================
                    // CURRENCY MAPPING
                    // ======================================

                    const selectedCurrency =
                        currencyMap[currency.toUpperCase()]
                        || currency.toUpperCase();


                    // ======================================
                    // FILTER CURRENCY
                    // ======================================

                    const activeRates =
                        result
                            .filter((x) =>
                                x.active === 1 &&
                                x.currency
                                    .trim()
                                    .toUpperCase() === selectedCurrency
                            )
                            .sort(
                                (a, b) =>
                                    a.yyyymm - b.yyyymm
                            );


                    // ======================================
                    // CHART DATA
                    // ======================================

                    const chartData: ChartData[] =
                        activeRates.map(
                            (item) => ({

                                mmmyyyy:
                                    item.mmmyyyy,

                                yyyymm:
                                    item.yyyymm,

                                rate:
                                    Number(item.rate)

                            })
                        );


                    setAllData(chartData);


                    // Initial filtering

                    setData(
                        getFilteredData(
                            chartData,
                            period
                        )
                    );


                } catch (error) {

                    console.error(
                        `Error loading ${currency}:`,
                        error
                    );

                    setError(
                        `Unable to load ${currency} exchange rate.`
                    );


                } finally {

                    setLoading(false);

                }

            };


            loadData();

        }, [currency]);


    // ==========================================
    // PERIOD FILTER
    // ==========================================

    useEffect(() => {

        if (allData.length === 0) {

            return;

        }


        const filtered =
            getFilteredData(
                allData,
                period
            );


        setData(filtered);

    }, [period, allData]);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div>
                Loading {currency}...
            </div>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div
                style={{
                    color: "red"
                }}
            >
                {error}
            </div>
        );

    }


    // ==========================================
    // NO DATA
    // ==========================================

    if (data.length === 0) {

        return (
            <div>
                No {currency} data available.
            </div>
        );

    }


    // ==========================================
    // Y-AXIS
    // ==========================================

    const axis =
        currencyYAxis[
            currency.toUpperCase()
        ] ||
        defaultYAxis;


    // ==========================================
    // LINE COLOR
    // ==========================================

    const lineColors: Record<
        string,
        string
    > = {

        PH: "#008000",

        MY: "#8A2BE2",

        US: "#1976D2",

        EU: "#FF8C00"

    };


    const lineColor =
        lineColors[
            currency.toUpperCase()
        ] ||
        "#1976D2";


    // ==========================================
    // DISPLAY
    // ==========================================

    return (

        <div
            style={{
                width: "100%"
            }}
        >

            <h2
                style={{
                    marginTop: 0,
                    fontSize: "16px"
                }}
            >
                {currencyDisplayName[currency.toUpperCase()]}
                {" "}
                {/* Exchange Rate  -- GRID HEADER TITLE  */}
            </h2>


            <LineChart
                width={600}
                height={350}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 20
                }}
            >

                <CartesianGrid
                    strokeDasharray="3 3"
                />

                <XAxis
                    dataKey="mmmyyyy"
                    angle={-90}
                    textAnchor="end"
                    height={100}
                    tickMargin={40}
                    tick={{
                        fontSize: 14
                    }}
                />


                <YAxis
                    domain={[
                        axis.min,
                        axis.max
                    ]}
                    ticks={axis.ticks}
                    tickFormatter={(value) =>
                        Number(value).toFixed(2)
                    
                    }
                    tick={{
                        fontSize: 14
                    }}
                />


                <Tooltip />

                {/* Legend, This show the Currency Initial at bottom chart */}
                {/* <Legend /> */}


                <Line
                    type="monotone"
                    dataKey="rate"
                    name={currency.toUpperCase()}
                    stroke={lineColor}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                />

            </LineChart>

        </div>

    );

};


// ==========================================
// FILTER FUNCTION
// ==========================================

function getFilteredData(
    source: ChartData[],
    period: PeriodOption
): ChartData[] {


    // ==========================================
    // ALL
    // ==========================================

    if (period === "ALL") {

        return source;

    }


    // ==========================================
    // TODAY
    // ==========================================

    const today = new Date();

    const currentYear =
        today.getFullYear();

    const currentMonth =
        today.getMonth() + 1;


    const currentYYYYMM =
        currentYear * 100 +
        currentMonth;


    // ==========================================
    // PERIOD
    // ==========================================

    let months = 6;


    if (period === "1Y") {

        months = 12;

    }


    if (period === "2Y") {

        months = 24;

    }


    // ==========================================
    // START MONTH
    // ==========================================

    const startDate =
        new Date(
            currentYear,
            currentMonth - 1 -
                (months - 1),
            1
        );


    const startYear =
        startDate.getFullYear();

    const startMonth =
        startDate.getMonth() + 1;


    const startYYYYMM =
        startYear * 100 +
        startMonth;


    // ==========================================
    // FILTER BY YYYYMM
    // ==========================================

    return source.filter(
        (item) =>
            item.yyyymm >= startYYYYMM &&
            item.yyyymm <= currentYYYYMM
    );

}


export default ExchangeRateSBChartMaster;