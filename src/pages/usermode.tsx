// file:    src/pages/usermode.tsx
//          REDUX 

import { useState, useEffect } from "react";

import { Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";   // RADIO BUTTON 

import { useDispatch, useSelector } from "react-redux";
import { updateRole } from "../store/userSlice";
import type { RootState } from "../store/store";

import { log } from "../config/debug";

import TooltipWrapper from "../components/customTooltipWrapper"; 

// import { loginAsRole } from "../api/authAPI";
// import { switchRole } from "../api/authAPI";
// import Tooltip from "@mui/material/Tooltip";
// import { setUser } from "../store/userSlice";

const roleMap: Record<string, { email: string; is_admin: number , name: string }> = {
    "0": { email: "user@example.com", is_admin: 0, name:"user" },
    "1": { email: "admin@example.com", is_admin: 1 , name:"admin"},
    "9": { email: "superadmin@example.com", is_admin: 1, name: "superadmin" },
  };

export default function UserMode() {

    const dispatch = useDispatch();

    // ✅ get from Redux (not localStorage)
    const currentLevel = useSelector((state: RootState) => state.user.is_level);

    // const isAdmin = useSelector((state: RootState) => state.user.is_admin);

    const [level, setLevel] = useState("0");

    // const canSwitchRole = Number(isAdmin) === 1;
    // if (!isAdmin) {
    //     console.warn("No permission to switch role");
    //     return <div>Access denied</div>;
    // }


    // REDUX IMPACT
    // sync UI with Redux
    // NEW: 
    useEffect(() => {
        setLevel(String(currentLevel ?? 0));
    }, [currentLevel]);

   
    // update state 
    const handleChange = async (
        _event: React.SyntheticEvent,
        value: string
    ) => {

        const role = roleMap[value];
        if (!role) return; // 🔥 prevents crash

        setLevel(value);

        // 1. call backend switch
        // const res = await switchRole({
        //     is_level: Number(value),
        // });

        // log("SWITCH RESULT:", res);

        // 2. 🔥 SAVE NEW TOKEN (VERY IMPORTANT)
        // localStorage.setItem("token", res.access_token);

        // 3. 🔥 UPDATE REDUX STATE (NO RELOAD NEEDED)
        dispatch(
                updateRole({
                    name: role.name,
                    is_admin: role.is_admin,
                    is_level: Number(value),
                })
            );

          
        log("src/pages/usermode: Redux updated instantly");

        log("src/pages/usermode: UPDATED USER (Redux):", {
                name: role.name,
                email: role.email,
                is_admin: role.is_admin,
                is_level: value,
            });


     };

  return (

    <>
        <h2>Access Level Switch</h2>  

        <TooltipWrapper
            title={
            <>
                - This module use to test the access level of User / Admin / SuperAdmin <br />
                - Select from Radio button to take effect the access level on Main Menu and User's details <br />
            </>
            }
           maxWidth={500}
        >
            <span className="my-cell">
            &nbsp;&nbsp;&nbsp;*&nbsp;&nbsp; Overview
            </span>
        </TooltipWrapper>

        <br></br><br></br>
        Level: 
        <br></br>

        {/* RADIO BUTTON  */}

        {/* {
            canSwitchRole ? ( */}
                <FormControl>
                    <RadioGroup
                        row   // 🔥 THIS makes it horizontal
                        value={level}
                        onChange={handleChange}
                        
                    >
                        <FormControlLabel value="0" control={<Radio />} label="User" />
                        <FormControlLabel value="1" control={<Radio />} label="Admin" />
                        <FormControlLabel value="9" control={<Radio />} label="Super Admin" />
                    </RadioGroup>
                </FormControl>
{/*                 
            ) : (
                <div style={{ color: "gray" }}>
                    No permission to switch role
                </div>
            )
        } */}

    </>

  );

}

//  BUTTON WAVE EFFECT, Declare
    //
    //  import { Box } from "@mui/material";    // BUTTON WAVE EFFECT
    //  import { Button, Menu, MenuItem } from "@mui/material";     // BUTTON WAVE EFFECT


//  BUTTON WAVE EFFECT, Inside Component: 
    //  
    //  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);   // BUTTON WAVE EFFECT
    //  return (

    //     {/* BUTTON WAVE EFFECT */}
                
    //     <Button onClick={(e) => setAnchorEl(e.currentTarget)}>
    //         Open Options
    //     </Button>

    //     <Menu
    //         anchorEl={anchorEl}
    //         open={Boolean(anchorEl)}
    //         onClose={() => setAnchorEl(null)}
    //     >
    //         <MenuItem onClick={() => setAnchorEl(null)}>Option 1</MenuItem>
    //         <MenuItem onClick={() => setAnchorEl(null)}>Option 2</MenuItem>
    //         <MenuItem onClick={() => setAnchorEl(null)}>Option 3</MenuItem>
    //     </Menu>
    //     <br></br>
    //  )

