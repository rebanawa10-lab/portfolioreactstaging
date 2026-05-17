// file:    src/components/mnunavbar/navbar.tsx    
//          REDUX 

import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Hamburger from './navbarhamburger'; 
import './navbar.css' ;
import { Link } from "react-router-dom";
import mnulogo from "../../assets/REBlogopng.png"
import { useNavigate } from "react-router-dom"; // DEMO Start. Hide cause logout button should not be there. Enable when Go-Live 


// REDUX 
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/userSlice"; // DEMO Start. Hide cause logout button should not be there. Enable when Go-Live 

// import {  } from "react-redux";

import { log } from "../../config/debug";


// -- sidebar rightside menu
// DEBUG MODE: SIDEBAR WIDTH SETTING
const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;                        /* Changed from right: 0 */
  height: 100vh;
  width: 280px;                   /* Adjust width as needed */ 
  background-color:  #bfc0f8;   /* Side bar background */
  padding: 2rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 999;
  color: white;
`;

// -- sidebar leftside popup menu 
const MenuVariants = {
  hidden: { opacity: 0, x: '-100%' },  // start off-screen left
  visible: { opacity: 1, x: 0 },       // slide in
  exit: { opacity: 0, x: '-100%' },    // slide out left
};


const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;  /* ✅ IMPORTANT */
  padding: 0 20px;                 /* spacing left/right */
  z-index: 998;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const CenterSection = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: blue;
`;


const LogoImage = styled.img`
  height: 40px;
  object-fit: contain;
  
`;




const App: React.FC = () => {
    const dispatch = useDispatch();   // DEMO Start. Hide cause logout button should not be there

    // 20260415
    const navigate = useNavigate();

    const handleLogout = () => {
      dispatch(logout());

      localStorage.clear();   //NOT APPLICABLE
      // localStorage.removeItem("user");
      // localStorage.removeItem("token");
      log("========== ========== ========== LOG OUT ")
      navigate("/", { replace: true });  // prevents user from clicking back button → returning to protected page
    };


    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

   
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const toggleSubMenu = (menu: string) => {
      setOpenSubMenu(prev => (prev === menu ? null : menu));
    };

    const SubMenuVariants = {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    };

    const handleMouseLeave = () => {
      setTimeout(() => {
        setOpenSubMenu(null);
      }, 150);  // 150ms delay before closing
    };

    // const is_GLoginType = Number(localStorage.getItem("is_GLoginType"));
    const is_LoginNavBar = Number(localStorage.getItem("is_LoginNavBar"));
    const is_LoginTypeID = localStorage.getItem("is_LoginTypeID");
    const is_LoginTypePWD = localStorage.getItem("is_LoginTypePWD");

    log("========== src/components/mnunavbar/navbar: Login Attribute:", {
                  NavBarType: is_LoginNavBar,
                  ID: is_LoginTypeID,
                  PWD: is_LoginTypePWD
              });
 
    // REDUX 
    const name = useSelector((state: RootState) => state.user.name);
    const isAdmin = useSelector((state: RootState) => state.user.is_admin);
    const isLevel = useSelector((state: RootState) => state.user.is_level);
   
    return (
      <>
   
      <div className="MainMnuPadding">

        <TopBar>

              {/* LEFT: Hamburger */}
              <LeftSection>
                <Hamburger isOpen={isOpen} toggleMenu={toggleMenu} />
              </LeftSection>

              {/* CENTER: Logo */}
              <CenterSection>
                <LogoImage src={mnulogo} alt="App Logo" />
              </CenterSection>

              {/* RIGHT: name */}
              <RightSection className="my-cell">
                {name ? (
                  <>
                    👤 [{name}]&nbsp;&nbsp;

                     {           
                        (is_LoginNavBar !== 9 && is_LoginNavBar !== 0 && is_LoginNavBar !== 7) &&                 
                            (
                              <button onClick={handleLogout} className="my-button">
                                Logout
                              </button>
                            )
                      }

                  </>
                ) : "Not logged in"}
              </RightSection>

        </TopBar>


        <Hamburger isOpen={isOpen} toggleMenu={toggleMenu} /> 
           
        {/* AnimatePresence Menu transition from Open/Close  */}
        <AnimatePresence>
            {isOpen && (
            <MenuOverlay
                variants={MenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4 }}
            >

                {/* Add menu links here */}
                <br></br>

                <ul className="MnuHdr">
                    <li className="MnuRowMargin" >                   
                        <Link to="/menu" onClick={() => setIsOpen(false)} className="menuLink">Home</Link>
                    </li>

                    <li className="MnuRowMargin" >                                  
                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="menuLink">Dashboard</Link>         
                    </li>

                    <li className="MnuRowMargin" >                                  
                        <Link to="/worldtoday" onClick={() => setIsOpen(false)} className="menuLink">World Today</Link>         
                    </li>

                    <li className="MnuRowMargin" >
                        <Link to="/mnuprogtypehover" onClick={() => setIsOpen(false)} className="menuLink">Menu type in Hover</Link>      
                    </li> 
                 
                    <li className="MnuRowMargin">

                        {/* Accordion Header */}
                        <motion.div
                          style={{ cursor: "pointer", color: "white" }}
                          onClick={() => toggleSubMenu("Programming")}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Menu Type in Accordion {openSubMenu === "Programming" ? "▾" : "▸"}
                        </motion.div>

                        {/* Accordion Content */}
                        <AnimatePresence>
                            {openSubMenu === "Programming" && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{
                                listStyle: "none",
                                paddingLeft: "15px",
                                marginTop: "8px"
                              }}
                            >
                                <li>
                                  <Link
                                    to="/mnuprogdtldb"
                                    onClick={() => setIsOpen(false)}
                                    className="menuLink"
                                  >
                                    Database
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    to="/mnuprogdtlauto"
                                    onClick={() => setIsOpen(false)}
                                    className="menuLink"
                                  >
                                    Automation Script
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    to="/mnuprogdtlsoftware"
                                    onClick={() => setIsOpen(false)}
                                    className="menuLink"
                                  >
                                    Software Development
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    to="/mnuprogdtlrpt"
                                    onClick={() => setIsOpen(false)}
                                    className="menuLink"
                                  >
                                    Reports
                                  </Link>
                                </li>

                          </motion.ul>
                           )}
                        </AnimatePresence>
                    </li>

                    {/* "Submenu nested sidebar */}
                    <li
                      className="MnuRowMargin"
                      style={{ position: "relative" }}
                      onMouseEnter={() => setOpenSubMenu("Submenu nested sidebar")}               
                      onMouseLeave={handleMouseLeave}
                    >

                        {/* Add Smooth Hover Animation */}
                        <motion.div
                          style={{ cursor: "pointer", color: "white" }}
                          onClick={() => toggleSubMenu("Submenu nested sidebar")}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          Menu type in Nested Sidebar ▸
                        </motion.div>

                        <AnimatePresence>
                              {openSubMenu === "Submenu nested sidebar" && (
                              <motion.ul
                                variants={SubMenuVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                style={{
                                  listStyle: "none",
                                  padding: "0.5rem",
                                  position: "absolute",
                                  top: 0,
                                  left: "100%",
                                  width: "200px",
                                  background: "#a7a9ee",
                                  borderRadius: "8px"
                                }}
                              >

                                  {/* MainMnu background #bfc0f8 */}
                                  {/* SampleOrig background: "#8d8ff0", */}
                                
                                  <li>
                                    <Link to="/mnuprogdtldb" onClick={() => setIsOpen(false)} className="menuLink" >Database</Link>
                                  </li>

                                  <li>
                                    <Link to="/mnuprogdtlauto" onClick={() => setIsOpen(false)} className="menuLink" >Automation Script</Link>
                                  </li>

                                  <li>
                                    <Link to="/mnuprogdtlsoftware" onClick={() => setIsOpen(false)} className="menuLink" >Software Development</Link>
                                  </li>

                                  <li>
                                    <Link to="/mnuprogdtlrpt" onClick={() => setIsOpen(false)} className="menuLink" >Reports</Link>
                                  </li>

                              </motion.ul>
                          )}
                        </AnimatePresence>

                    </li>

                    {/* FastAPIService, Onhold:      */}
                    {/* <li className="MnuRowMargin" >                                  
                          <Link to="/CRUDv1" onClick={() => setIsOpen(false)} className="menuLink">Data: CRUD To-Do (FastAPI)</Link>         
                    </li> */}

                   

                     <li className="MnuRowMargin">
                        <Link to="/usermode" onClick={() => setIsOpen(false)} className="menuLink">* Access Level Switch</Link>
                    </li>



                     {/* User Level */}    
                      {isLevel >= 0 && (            
          
                        <li
                          className="MnuRowMargin"
                          style={{ position: "relative" }}
                          onMouseEnter={() => setOpenSubMenu("Submenu nested userlvl")}               
                          onMouseLeave={handleMouseLeave}
                        >
                      
                            <motion.div
                              style={{ cursor: "pointer", color: "white" }}
                              onClick={() => toggleSubMenu("Submenu nested userlvl")}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              User Access: ▸
                            </motion.div>
                            <AnimatePresence>
                                  {openSubMenu === "Submenu nested userlvl" && (
                                  <motion.ul
                                    variants={SubMenuVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    style={{
                                      listStyle: "none",
                                      padding: "0.5rem",
                                      position: "absolute",
                                      top: 0,
                                      left: "100%",
                                      width: "260px",
                                      background: "#a7a9ee",
                                      borderRadius: "8px"
                                    }}
                                  >
                
                                       {/* FastAPIService, Ok Done:      */}
                                      <li className="MnuRowMargin" >                                  
                                            <Link to="/CRUDTasksToDo" onClick={() => setIsOpen(false)} className="menuLink">CRUD Tasks list</Link>         
                                      </li>
                                      

                                      <li className="MnuRowMargin" >                                  
                                            <Link to="/CRUDv2" onClick={() => setIsOpen(false)} className="menuLink">CRUD To-Do list</Link>         
                                      </li>
                                    
                                    
                                      <li className="MnuRowMargin" >                                  
                                            <Link to="/prntlst" onClick={() => setIsOpen(false)} className="menuLink">Print Data list</Link>         
                                      </li>

                                       

                                </motion.ul>
                              )}
                            </AnimatePresence>

                         </li>

                        )}    

                 

           
                    {/* Admin */}
                    {isAdmin === 1 && isLevel >= 1 && (
                      <li className="MnuRowMargin">
                        <Link to="/users" onClick={() => setIsOpen(false)} className="menuLink">Admin Acccess: CRUD Users</Link>
                      </li>
                    )}

                    {/* Super Admin Start */}    
                    {isAdmin === 1 && isLevel === 9 && (            
          
                        <li
                          className="MnuRowMargin"
                          style={{ position: "relative" }}
                          onMouseEnter={() => setOpenSubMenu("Submenu nested sidebarv2")}               
                          onMouseLeave={handleMouseLeave}
                        >
                      
                            <motion.div
                              style={{ cursor: "pointer", color: "white" }}
                              onClick={() => toggleSubMenu("Submenu nested sidebarv2")}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              SuperAdmin Access: Ref ▸
                            </motion.div>
                            <AnimatePresence>
                                  {openSubMenu === "Submenu nested sidebarv2" && (
                                  <motion.ul
                                    variants={SubMenuVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    style={{
                                      listStyle: "none",
                                      padding: "0.5rem",
                                      position: "absolute",
                                      top: 0,
                                      left: "100%",
                                      width: "260px",
                                      background: "#a7a9ee",
                                      borderRadius: "8px"
                                    }}
                                  >
                
                                        <li className="MnuRowMargin" >                                  
                                              <Link to="/okreviewtradesimulation" onClick={() => setIsOpen(false)} className="menuLink">Trading simulation</Link>         
                                        </li>

                                        <li className="MnuRowMargin" >                                  
                                              <Link to="/okreviewhomegifwall" onClick={() => setIsOpen(false)} className="menuLink">Home GIF wall</Link>         
                                        </li>

                                        <li className="MnuRowMargin" >                                  
                                              <Link to="/okreviewgoldtwelvedata" onClick={() => setIsOpen(false)} className="menuLink">Gold Price</Link>         
                                        </li>

                                        <li className="MnuRowMargin" >    
                                          <Link to="/ReviewAccordion" onClick={() => setIsOpen(false)} className="menuLink" >Accordion</Link>
                                        </li>

                                        <li className="MnuRowMargin" >    
                                          <Link to="/ReviewNSB2AnnouncementJSON" onClick={() => setIsOpen(false)} className="menuLink" >Announcement JSON file</Link>
                                        </li>

                                        <li className="MnuRowMargin" >    
                                          <Link to="/Review4TypesAnnouncement" onClick={() => setIsOpen(false)} className="menuLink" >Announcement 4 Types</Link>
                                        </li>

                                        <li className="MnuRowMargin" >    
                                          <Link to="/ReviewLoadTxtAndDisp" onClick={() => setIsOpen(false)} className="menuLink" >Load text and display</Link>
                                        </li>

                                        <li className="MnuRowMargin" >    
                                          <Link to="/ReviewImageScrollHoriV1" onClick={() => setIsOpen(false)} className="menuLink" >Image scroll</Link>
                                        </li>

                                        <li className="MnuRowMargin" >    
                                          <Link to="/ReviewImageScrollHoriV2" onClick={() => setIsOpen(false)} className="menuLink" >Image scroll by Group</Link>
                                        </li>

                                        <li className="MnuRowMargin" >    
                                              <Link to="/ReviewVertMsg" onClick={() => setIsOpen(false)} className="menuLink" >Vertical Msg V1</Link>
                                        </li>

                                        <li className="MnuRowMargin" >    
                                              <Link to="/ReviewVertMsgV2" onClick={() => setIsOpen(false)} className="menuLink" >Vertical Msg V1</Link>
                                        </li>


                                </motion.ul>
                              )}
                            </AnimatePresence>

                         </li>

                        )}    

                    {/* Super Admin End */}    
                    

                    <li className="MnuRowMargin" >
                      <Link to="/about" onClick={() => setIsOpen(false)} className="menuLink">About</Link> 
                    </li>

                   


                </ul>

            </MenuOverlay>

            )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default App;


