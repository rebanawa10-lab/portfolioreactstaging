


// file:   C:\Repos\PortfolioStaging\React\src\exchangerate\exchangeRateAPIservice.ts

// ==========================================
// Exchange Rate API Service
// ==========================================

import axios from "axios";

import { log } from "../config/debug" ;

const API_BASE = import.meta.env.VITE_NODEJS_API;



// ==========================================
// TYPES
// ==========================================

export interface ExchangeRate {
    Currency: string;
    MMMYYYY: string;
    YYYYMM: number;
    Rate: number;
    Active: number;
    SysDateCreate?: string;
}


// ==========================================
// GET ACTIVE EXCHANGE RATES
// ==========================================

export const getExchangeRates = async (): Promise<ExchangeRate[]> => {

    log( "Exchange Rate API:", `${API_BASE}/api/exchangerate` );

    try {

        const response = await axios.get<ExchangeRate[]>(
            `${API_BASE}/api/exchangerate`
        );

        log( "Exchange Rate Response:", response.data );

        return response.data;

    } catch (error) {

        console.error(
            "Exchange Rate API Error:",
            error
        );

        throw error;
    }
};


// ==========================================
// GET EXCHANGE RATES BY CURRENCY
// ==========================================

export const getExchangeRatesByCurrency = async (
    currency: string
): Promise<ExchangeRate[]> => {

    try {

        const response = await axios.get<ExchangeRate[]>(
            `${API_BASE}/api/exchangerate/${encodeURIComponent(currency)}`
        );

        return response.data;

    } catch (error) {

        console.error(
            `Error loading exchange rates for ${currency}:`,
            error
        );

        throw error;
    }
};




