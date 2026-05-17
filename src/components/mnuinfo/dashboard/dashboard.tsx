// file:    dashboard.tsx

// import { BorderStyle } from "@mui/icons-material";
import "./dashboard.css";
import MyBitcoin from "./bitcoinBinance";
import MyWeather from "./weather" ;
import MyWeather5Days from "./weather5daysforecast"; 
import MyForexTicker from "./forexticker";

import MyGold from "./goldBinance";
import MyGoldPrice from "./goldBinancePrice";

import Myxrate from "./exchangeMain";

// KEEP !! 
// import Accordion from "../../mnuReview/accordionfunc" ;

import TooltipWrapper from "../../../components/customTooltipWrapper";  
// import PublicIcon from "@mui/icons-material/Public";
import DashboardIcon from "@mui/icons-material/Dashboard";


export default function funcinfodashboard(){

    return(
    <div>
        <h2>Dashboard</h2> 


        <div>
            <TooltipWrapper
                    title={
                <>                
                    Welcome to the Dashboard 
                            <span
                                className="my-cell"
                                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                            > &nbsp;
                                 <DashboardIcon sx={{ fontSize: 20 }} />

                               
                                
                            </span>
                    
                        <br /> <br />                 
                    Get a quick overview of the key metrics, track progress, and make data-driven decisions all in one place. <br />
                    Navigate through the sections to monitor performance, analyze trends, and stay on top of what matters most.<br /><br />


                    Bitcoin and Gold Live chart by Binance WebSocket API enables real-time, bidirectional communication for market data retrieval, trading and account management.<br /><br />

                    OpenWeatherMap API provides current weather data, forecasts and historical data for any geographic location. Weather Today is auto-update every 1 hour.<br /><br />

                    Exchangerate.host API provides a simple REST API with real-time and historical exchange rates for 168 world currencies, <br />
                    delivering currency pairs in universally usable JSON format - compatible with any of your applications.<br /><br />

                </>
                }
                maxWidth={1000}
            >
                <span className="my-cell">
                &nbsp;&nbsp;&nbsp;*&nbsp;&nbsp; Overview
                </span>

            </TooltipWrapper>

            <br></br><br></br>

        </div>       
        
        {/* KEEP !! 
        <Accordion title="Highlight">
            <p className="DivTxtFormatHighlight">            
            Welcome to the Dashboard <br></br><br></br>
            Get a quick overview of the key metrics, track progress, and make data-driven decisions all in one place. 
            Navigate through the sections to monitor performance, analyze trends, and stay on top of what matters most.
            </p>
           
        </Accordion>
         <br></br> */}

        <div className="dashboard">

            {/* LEFT COLUMN */}
            <div className="left-column">
                <div style={styles.widgetTitle}>Bitcoin (Live! chart)</div>
                <MyBitcoin />            
            </div>

            {/* RIGHT COLUMN */}
            <div className="right-column"> 
                <div className="weather-row">
                    <div>
                        <div style={styles.widgetTitle}>Weather Today</div>
                        <MyWeather />
                    </div>

                    <div>
                        <div style={styles.widgetTitle}>5-Day Forecast</div>
                        <MyWeather5Days />
                    </div>
                </div>

                <div className="forex-row">
                    <MyForexTicker />
                </div>

            </div>

        </div>

        <div style={styles.page}>
            <div style={styles.frame}>
     

                    {/* Row2: Gold chart */}
                    <div style={styles.Row2}>
                        <div style={styles.Row2GoldTrade}>
                            <div style={styles.widgetTitle}>Gold (Live! chart)</div>
                            <MyGold />
                        </div>

                        <div style={styles.Row2GoldPrice}>
                            <div style={styles.widgetTitle}>&nbsp;</div>
                            <MyGoldPrice />
                        </div>               
                    </div>


                    {/* Row3: Exchange Rates */}
                    <div style={styles.Row3Hdr}>
                        Exchange rates today and history (USD, MYR, PHP)
                    </div>
                
                    <div style={styles.Row3}>
                        <div style={styles.Row3XRate}>
                            <Myxrate />
                        </div>
                        <div style={styles.Row3XRate}>
                            {/* Optional: Another widget can go here */}
                        </div>
                    </div>
                    
            </div>
        </div>

           

    </div>
    )
}

const styles = {
    page: {
        background: "white",      // ORIG: #eef2f7light background like Yahoo
        minHeight: "90vh",
        padding: "2px",
        display: "flex",
        justifyContent: "left",
        
    },
    // ORIG: 
    // background: "white", 


    frame: {
        background: "#ffffff",  
        borderRadius: "20px",
        padding: "1px",
        width: "500px",
    },
    // boxShadow: "0 10px 30px rgba(0,0,0,0.08)", // ORIG
   
    // Row1: {
    //     display: "flex",
    //     gap: "10px",
    // },

    widgetTitle: {       
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: 600,    
    },
 
    
    Row2: {
        display: "flex",
        gap: "10px",     
        marginTop: "20px",
        // background: "yellow",
    },

    Row2GoldTrade: {
        flex: "0 0 70%",   
    },

    Row2GoldPrice: {
        flex: "0 0 70%",   
    },

    Row3Hdr: {
        display: "flex",
        gap: "10px",   
        marginTop: "40px",
        fontSize: "14px",
        fontWeight: 600,    
        // background: "blue",   
    },

    Row3: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },

    Row3XRate: {
        flex: "1", // equal width columns
    },

};