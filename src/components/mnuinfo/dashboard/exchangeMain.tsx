
// file:    exchangeMain.tsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

// DEBUG MODE: Hide Exchange Rate Smry
import ExchangeSMRY from "./exchangeSMRY";

import exchangeDataUSD from "./exchangeSGDUSDdata.json";
import exchangeDataMYR from "./exchangeSGDMYRdata.json";
import exchangeDataPHP from "./exchangeSGDPHPdata.json";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Map JSON to labels and data
const USDlabels = exchangeDataUSD.map((item) => item.MMMYYYY);
const USDdataPoints = exchangeDataUSD.map((item) => item.xrate);

const USDdata = {
  labels: USDlabels,
  datasets: [
    {
      label: "SGD → USD",
      data: USDdataPoints,
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.2)",
      tension: 0.2, // smooth line
    },
  ],
};


const MYRlabels = exchangeDataMYR.map((item) => item.MMMYYYY);
const MYRdataPoints = exchangeDataMYR.map((item) => item.xrate);
const MYRdata = {
  labels: MYRlabels,
  datasets: [
    {
      label: "SGD → MYR",
      data: MYRdataPoints,
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.2)",
      tension: 0.2, // smooth line
    },
  ],
};


const PHPlabels = exchangeDataPHP.map((item) => item.MMMYYYY);
const PHPdataPoints = exchangeDataPHP.map((item) => item.xrate);
const PHPdata = {
  labels: PHPlabels,
  datasets: [
    {
      label: "SGD → PHP",
      data: PHPdataPoints,
      borderColor: "blue",
      backgroundColor: "rgba(0,0,255,0.2)",
      tension: 0.2, // smooth line
    },
  ],
};

export default function SgdUsdChart() {
  return (

     <div>
        <div style={styles.gridContainer}>
            <div style={styles.gridItem}>
                <h3>Exchange Rates (Base: SGD)</h3>   
                {/* DEBUG MODE: Hide Exchange Rate Smry */}
                <ExchangeSMRY />   
            </div>

            <div style={styles.gridItem}>
                <h3>SGD → USD</h3>
                <Line data={USDdata} />
            </div>
            
            <div style={styles.gridItem}>
                <h3>SGD → MYR</h3>
                <Line data={MYRdata} />
            </div>

            <div style={styles.gridItem}>
                <h3>SGD → PHP</h3>
            <Line data={PHPdata} />
            </div>
        </div>
     </div>

  )
}


const styles: { [key: string]: React.CSSProperties } = {
  // Ver1
  // gridContainer: {
  //   display: "grid",
  //   gridTemplateColumns: "1fr 1fr", // 2 columns
  //   gridTemplateRows: "1fr 1fr",    // 2 rows
  //   gap: "20px",
  //   padding: "1px",
  // },

  // gridItem: {
  //   background: "#f5f5f5",
  //   borderRadius: "8px",
  //   padding: "15px",
  //   boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
  // },


  // Ver2
      gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 460px)", // fixed smaller width
      gap: "12px",
      justifyContent: "left",
      },

      gridItem: {
      background: "#f5f5f5",
      borderRadius: "6px",
      padding: "8px",          // smaller padding
      boxShadow: "0px 1px 4px rgba(0,0,0,0.08)", // lighter shadow
      },

};
