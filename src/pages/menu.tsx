// file:  src/pages/Menu.tsx


import '../App.css';
import { Routes, Route } from "react-router-dom";

import { log } from "../config/debug";

import  env from "../config/env";

import ProtectedAdminRoute from "../components/ProtectedAdminRoute"; 

// import React from "react";
// import { Navigate } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { BASE_PATH } from "../../src/config" ;


import MnuNavBar from './../components/mnunavbar/navbar';   // Single Page Application (SPA) method. MainMenu

import MnuInfoHome from "./../components/mnuinfo/home/homeaurora";  //HomeAurora

import MnuInfoDashboard from "./../components/mnuinfo/dashboard/dashboard" ; // Dashboard
import MnuAddOnWorldToday from "./../components/mnuinfo/worldtoday/worldtoday"; // World Today


// Menu Type Hover / Accordion / Nested Sidebar
import MnuProgTypeHover from "./../components/mnuPersonal/mnuproghover/mnuproghovermain";
import MnuPersonalProgDtlDB from "./../components/mnuPersonal/mnuproghover/dtldb";
import MnuPersonalProgDtlAuto from "./../components/mnuPersonal/mnuproghover/dtlscripting";
import MnuPersonalProgDtlSoftWare from "./../components/mnuPersonal/mnuproghover/dtlprog";
import MnuPersonalProgDtlRpt from "./../components/mnuPersonal/mnuproghover/dtlreports";


import MnuCRUDTaskTodo from "./../pages/tasks" ;  // Data: CRUD Tasks To-Do (FastAPI)   
    // Devt Data:       MS SQL Server (DB: AzureSQL, tbl: TaskToDo )                 
    // Devt FastAPI:    C:\Repos\PortfolioStaging\ReactCRUDFastAPIIIS, Services.msc: FastAPIService.
    // Prod Data:       INPROGRESS..  Supabase (tbl: Todo)
    // Note:            INPROGRESS..  No Vercel API at the moment


import MnuCRUDTodov2Page from "./../pages/todov2Page" ; // Data: CRUD To-Do
    // Devt Data:       MS SQL Server (DB: AzureSQL, tbl: Todo)     
    // Devt NodeJS:     /api/todo
    // Devt NodeJS:     Devt and IIS, C:\Repos\Portfolio\APINodeJS, Services.msc: NodeAPI
    //                  VITE_NODEJS_API=http://localhost:3000
    // Prod Data:       VITE_NODEJS_API=https://apinodejssupabaseprod.vercel.app
    // Prod Data:       Supabase (tbl: Todo)


import MnuDataJSONExecSales from "./../components/mnuDataJSON/execsalesgrid";   //  Data: Print list
    // Devt Data:       Data\datasalesman.json
    // Devt NodeJS:     /api/sales`
    // Devt NodeJS:     Devt and IIS, C:\Repos\Portfolio\APINodeJS, Services.msc: NodeAPI
    //                  VITE_NODEJS_API=http://localhost:3000
    // Prod Data:       VITE_NODEJS_API=https://apinodejssupabaseprod.vercel.app


import MnuInfoAbout from "./../components/mnuinfo/about/about"; // About


// REB keep as reference START
import ReviewTradeSimulation from "./../components/mnuReview/okTradeSimulationMain";    // Review Trading simulation, Candle stick sample
import ReviewHomeGIFWall from "./../components/mnuReview/okhomeGIFWall"; // Home GIF
import ReviewGoldTwelveData from "./../components/mnuReview/okgoldtwelvedata"; // Gold TwelveData
import ReviewAccordion from "./../components/mnuReview/accordion";   // Accordion simple

import ReviewNSB2AnnouncementJSON from "../components/mnuReview/announcement5main";
    // Data JSON:   scolling message. import Announcement5Vert from "../../../public/announcement5URL.json" 

import Review4TypesAnnouncement from "../components/mnuReview/announcementmain";
    // Announcement 4 types 

import ReviewLoadTxtAndDisp from "../components/mnuReview/txtvw"; 
    // load text file and display 

import ReviewImageScrollHoriV1 from "../components/mnuReview/imgscrollhorizonalv1";
    // Scroll Image Prev and Next. See Asset Folder.

import ReviewImageScrollHoriV2 from "../components/mnuReview/imgscrollhorizonalv2";
    // Scroll Image by group of 4, Prev and Next.  See Asset Folder.

// REB keep as reference END 

import ReviewVertMsg from "../components/mnuReview/tickerverticalsmoothpause";
    // Scroll vertical text  

import ReviewVertMsgV2 from "../components/mnuReview/announcement6VertOpenURL";
    // Scroll vertical URL


import UsersPage from  "../pages/users"; 
    // Devt Data:       MS SQL Server (DB: AzureSQL, tbl: Users)     
    // Devt NodeJS:     xx /api/todo
    // Devt NodeJS:     xx Devt and IIS, C:\Repos\Portfolio\APINodeJS, Services.msc: NodeAPI
    //                  xx VITE_NODEJS_API=http://localhost:3000
    // Prod Data:       xx VITE_NODEJS_API=https://apinodejssupabaseprod.vercel.app
    // Prod Data:       xx Supabase (tbl: Todo)


import UserMode from "../pages/usermode"; 


console.log("===== ENVIRONMENT INFO =====");
console.log("src/pages/Menu: MODE:", import.meta.env.MODE);
console.log("src/pages/Menu: BASE:", import.meta.env.BASE_URL);
console.log("src/pages/Menu: API:", import.meta.env.VITE_API_BASE);

console.log(`src/pages/Menu: MODE:  ${env.mode}`);
console.log(`src/pages/Menu: BASE:  ${env.baseUrl}`);
console.log(`src/pages/Menu: API:   ${env.apiBase}`);   

console.log("============================");

// log("src/pages/Menu: Menu loaded");
console.log("========== src/pages/Menu.tsx Loaded ##### ");
console.log("CONFIG src/pages/Menu: Menu loaded");

log("========== src/pages/Menu.tsx Loaded EOF ##### ");


const Menu = () => {
  return (
    <div>
      <MnuNavBar />

      <div className="main-content">
        <Routes>
        
                {/* <Route index element={<MnuInfoHome />} /> */}
               

                <Route path="" element={<MnuInfoHome />} />

                <Route path="dashboard" element={<MnuInfoDashboard />} />
                <Route path="worldtoday" element={<MnuAddOnWorldToday />} /> 


                <Route path="mnuprogtypehover" element={<MnuProgTypeHover />} />
                <Route path="mnuprogdtldb" element={<MnuPersonalProgDtlDB />} /> 
                <Route path="mnuprogdtlauto" element={<MnuPersonalProgDtlAuto />} />
                <Route path="mnuprogdtlsoftware" element={<MnuPersonalProgDtlSoftWare />} />
                <Route path="mnuprogdtlrpt" element={<MnuPersonalProgDtlRpt />} />


                {/* <Route path="CRUDv1" element={<MnuCRUDTodo />} /> */}
                
                <Route path="CRUDTasksToDo" element={<MnuCRUDTaskTodo />} />
                <Route path="CRUDv2" element={<MnuCRUDTodov2Page />} />
                <Route path="prntlst" element={<MnuDataJSONExecSales />} />

                <Route
                    path="users"
                    element={
                        <ProtectedAdminRoute>
                            <UsersPage />
                        </ProtectedAdminRoute>
                    }
                />
                <Route path="usermode" element={<UserMode />} />


                <Route path="about" element={<MnuInfoAbout />} />


                {/* REB keep as reference START */}

                <Route path="okreviewtradesimulation" element={<ReviewTradeSimulation />} />
                <Route path="okreviewhomegifwall" element={<ReviewHomeGIFWall />} />
                <Route path="okreviewgoldtwelvedata" element={<ReviewGoldTwelveData />} />
                <Route path="ReviewAccordion" element={<ReviewAccordion />} />
                <Route path="ReviewNSB2AnnouncementJSON" element={<ReviewNSB2AnnouncementJSON />} />
                <Route path="Review4TypesAnnouncement" element={<Review4TypesAnnouncement />} />
                <Route path="ReviewLoadTxtAndDisp" element={<ReviewLoadTxtAndDisp />} />
                <Route path="ReviewImageScrollHoriV1" element={<ReviewImageScrollHoriV1 />} />
                <Route path="ReviewImageScrollHoriV2" element={<ReviewImageScrollHoriV2 />} />
  
                <Route 
                    path="ReviewVertMsg" 
                    element={
                        <ReviewVertMsg 
                        announcements={[
                            "Message 1",
                            "Message 2",
                            "Message 3"
                        ]} 
                        />
                    } 
                />

               
                <Route 
                    path="ReviewVertMsgV2" 
                    element={
                        <ReviewVertMsgV2
                        announcements={[
                            { message: "Google", url: "https://www.google.com" },
                            { message: "Open Dashboard", onClick: () => alert("Go Dashboard") },
                            { message: "No link message" }
                        ]}
                        />
                    } 
                />


                {/* REB keep as reference END  */}

        
        </Routes>
      </div>
    </div>
  );
};

export default Menu;
