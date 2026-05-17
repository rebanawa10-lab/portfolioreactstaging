 // file:    src/components/mnunReview/okTradeSimulationMain.tsx

import React from "react";
import CandlestickSimulate from "./okTradeSimulation";


const App: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>

      <h2>Trading Monitor (Live Simulation)</h2>
      <CandlestickSimulate />

    </div>
  );
};

export default App;
