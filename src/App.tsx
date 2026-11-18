


// file:    C:\Repos\Portfolio\React\src\App.tsx
//          REDUX 

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";

//  LOGIN.TSX ENABLE
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "../src/components/login" ; 


import Menu from "./pages/menu"  ;

// LOGIN.TSX ENABLE / NOT ENABLE. JUST KEEP HIDE 
// import MnuInfoHome from "./components/mnuinfo/home/homeaurora";

import { Navigate } from "react-router-dom";

import { useEffect } from "react";

import { log } from "./config/debug";

// 202609 15
import AIAgent from "./ai/AIAgent";
  
const App: React.FC = () => {

  log("==F: APP.TSX Loaded ##### ");
    
  
  // REDUX Start, MUST be inside component
  const dispatch = useDispatch(); 

  // RESTORE USER ON APP LOAD
  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    log("🔵 src/App.tsx: App load: raw localStorage 'user' =", savedUser);
    log("==F: APP.TSX setuser=", savedUser);



    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      log("🟢 src/App.tsx: Parsed user object =", parsedUser);
      log("🚀 src/App.tsx: Dispatching setUser...");

      dispatch(setUser(JSON.parse(savedUser)));

    } else {
      log("⚠️ src/App.tsx: No user found in localStorage");
    }
  }, [dispatch]);
  // REDUX End 

  return (

    // 0260426 
    // ORIG
    // <Router>

    // TEST
    <Router basename={import.meta.env.BASE_URL}>

   
            
            {/* ============================================ */}
            {/* DEFAULT APPLICATION for Login ENABLE 
            
            LOGIN.TSX ENABLE, set this above
            import ProtectedRoute from "./components/ProtectedRoute";
            import Login from "../src/components/login" ; 


            net start FastAPIService
            - or - 
			      net stop FastAPIService 
			
         
            */}

            
          {/* <Routes>
            <Route index element={<Login />} />
                  <Route
                    path="menu/*"
                    element={
                      <ProtectedRoute>
                        <Menu />
                      </ProtectedRoute>
                    }
                  /> 
                  
                  <Route path="employees"  element={<Navigate to="/menu/employeesb" /> } />  
                  <Route path="exchangeratetoday" element={<Navigate to="/menu/exchangeratetodaysb" />} />  
                  <Route path="dashboard" element={<Navigate to="/menu/dashboard" />} />
                  <Route path="worldtoday" element={<Navigate to="/menu/worldtoday" />} />
                  <Route path="about" element={<Navigate to="/menu/about" />} />

                  
                  <Route path="employeeiis"  element={<Navigate to="/menu/employeeiis" /> } />  
                  <Route path="exchangeratetodayiis" element={<Navigate to="/menu/exchangeratetodayiis" />} />  


          </Routes> */}


            

            {/* ============================================ */}
            {/* DEFAULT APPLICATION for LOGIN.TSX NOT ENABLE */}
            {/* MnuInfoHome, Default content inside/menu/*  
            
               <Route path="/" element={<Menu />} />            , DEFAULT

               <Route path="/menu/*" element={<Menu />} />      , MENU 
            
            */}


              <Routes>              
                    <Route path="/*" element={<Menu />} />                
                    <Route path="/menu/*" element={<Menu />} />

                    <Route path="employees"  element={<Navigate to="/menu/employeesb" /> } />    
                    <Route path="employeeskpi"  element={<Navigate to="/menu/employeekpisb" /> } />                     
                    <Route path="exchangeratetoday" element={<Navigate to="/menu/exchangeratetodaysb" />} />   
                  
                    <Route path="dashboard" element={<Navigate to="/menu/dashboard" />} />
                    <Route path="worldtoday" element={<Navigate to="/menu/worldtoday" />} />
                    <Route path="about" element={<Navigate to="/menu/about" />} />
                    <Route path="aiagent" element={<Navigate to="/menu/aiagent" />} />

                    <Route path="employeeiis"  element={<Navigate to="/menu/employeeiis" /> } />  
                    <Route path="exchangeratetodayiis" element={<Navigate to="/menu/exchangeratetodayiis" />} />  
                    <Route path="employeekpidashboardiis" element={<Navigate to="/menu/employeekpidashboardiis" />} /> 

                  <Route path="employeekpireport" element={<Navigate to="/menu/employeekpireport" />} /> 

                
                    <Route path="mnuprogtypehover" element={<Navigate to="/menu/MnuProgTypeHover" />} />
                    <Route path="mnuprogdtldb" element={<Navigate to="/menu/mnuprogdtldb" />} />
                    <Route path="mnuprogdtlauto" element={<Navigate to="/menu/mnuprogdtlauto" />} />
                    <Route path="mnuprogdtlsoftware" element={<Navigate to="/menu/mnuprogdtlsoftware" />} />
                    <Route path="mnuprogdtlrpt" element={<Navigate to="/menu/mnuprogdtlrpt" />} />

                    <Route path="CRUDTasksToDo" element={<Navigate to="/menu/CRUDTasksToDo" />} />
                    <Route path="CRUDv2" element={<Navigate to="/menu/CRUDv2" />} />
                    <Route path="prntlst" element={<Navigate to="/menu/prntlst" />} />
            
                    <Route path="users" element={<Navigate to="/menu/users" />} />
                    <Route path="usermode" element={<Navigate to="/menu/usermode" />} />

                    <Route path="okreviewtradesimulation" element={<Navigate to="/menu/okreviewtradesimulation" />} />
                    <Route path="okreviewhomegifwall" element={<Navigate to="/menu/okreviewhomegifwall" />} />
                    <Route path="okreviewgoldtwelvedata" element={<Navigate to="/menu/okreviewgoldtwelvedata" />} />
                    <Route path="ReviewAccordion" element={<Navigate to="/menu/ReviewAccordion" />} />
                    <Route path="ReviewNSB2AnnouncementJSON" element={<Navigate to="/menu/ReviewNSB2AnnouncementJSON" />} />
                    <Route path="Review4TypesAnnouncement" element={<Navigate to="/menu/Review4TypesAnnouncement" />} />
                    <Route path="ReviewLoadTxtAndDisp" element={<Navigate to="/menu/ReviewLoadTxtAndDisp" />} />
                    <Route path="ReviewImageScrollHoriV1" element={<Navigate to="/menu/ReviewImageScrollHoriV1" />} />
                    <Route path="ReviewImageScrollHoriV2" element={<Navigate to="/menu/ReviewImageScrollHoriV2" />} />
                    <Route path="ReviewVertMsg" element={<Navigate to="/menu/ReviewVertMsg" />} />
                    <Route path="ReviewVertMsgV2" element={<Navigate to="/menu/ReviewVertMsgV2" />} />
              </Routes>

      {/* 202609 13  AI Agent available throughout the application */}
      <AIAgent />

    </Router>
  );
};

export default App;
