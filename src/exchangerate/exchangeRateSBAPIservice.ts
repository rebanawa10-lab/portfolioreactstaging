


// file:   C:\Repos\PortfolioStaging\React\src\exchangerate\exchangeRateSBAPIservice.ts


// ==========================================
// Exchange Rate API Service
// ==========================================

import axios from "axios";

import { log } from "../config/debug" ;

const API_BASE = import.meta.env.VITE_NODEJS_API_CLOUD;


// ==========================================
// TYPES
// ==========================================

export interface ExchangeRate {
    currency: string;
    mmmyyyy: string;
    yyyymm: number;
    rate: number;
    active: number;
    sysdatecreate?: string;
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

        log( "getExchangeRates Response:", response.data );

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

        log( "getExchangeRatesByCurrency Response:", response.data );

        return response.data;

    } catch (error) {

        console.error(
            `Error loading exchange rates for ${currency}:`,
            error
        );

        throw error;
    }
};




