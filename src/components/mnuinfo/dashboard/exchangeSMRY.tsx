// file:    exchangeSMRY.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import type { RatesResponse } from "../../../utils/types" ;




const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;

// log("API KEY:", API_KEY);

function XRate() {
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get<RatesResponse>(
          "https://api.apilayer.com/exchangerates_data/latest",
          {
            // params: { base: "SGD", symbols: "USD,EUR,GBP,JPY,PHP,MYR,THB,HKD,IDR" },
            params: { base: "SGD", symbols: "USD,MYR,PHP" },
            headers: { apikey: API_KEY },
          }
        );

        setRates(response.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
        {/* <h2>Exchange Rates (Base: {rates?.base})</h2> */}
        {rates &&
        Object.entries(rates.rates).map(([currency, value]) => (
          <div key={currency}>
            {currency}: {value}
          </div>
        ))}

    </div>
  );
}

export default  XRate;
