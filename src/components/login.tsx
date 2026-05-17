// file:    src/components/Login.tsx
//          REDUX 

import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


// REDUX Start 
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

import { log } from "../config/debug";


interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;    // add this
  is_admin: number;    // add this if returned by your API
  is_level: number;
}
// REDUX End


const Login: React.FC = () => {
  log("========== src/components/Login.tsx Loaded ##### ");

  // DEBUG MODE: Chrome clear the cache and hard start the browser if value below has been change for testing``
  const loginType = Number(localStorage.getItem("is_GLoginType") ?? "7");
    // KEEP !! LOGIN NOTE
    // const is_LoginType = Number(localStorage.getItem("is_GLoginType"));
    // is_LoginType value:
    // "0" hide the login/password text box; Directly load main menu, login=admin@example.com, password=password
    // "1" show the login/password text box; blank value on login/password
    // "2" show the login/password text box; login=admin@example.com, password=password
    // "3" show the login/password text box; login=user@example.com, password=password
    // "4" show the login/password text box; login=superadmin@example.com, password=password
    // "9" hide the login/password text box; Directly load main menu, blank value on login/password

    // Cloud 
    // "6" show the login/password text box; login=admin@example.com, password=1234567890
    // "7" hide the login/password text box; Directly load main menu, login=admin@example.com, password=1234567890
  


  // Lazy initializer, do this with a function initializer to delay reading from localStorage until the component mounts:
  const [email, setEmail] = useState<string>(() => localStorage.getItem("is_LoginTypeID") ?? "");
  const [password, setPassword] = useState<string>(() => localStorage.getItem("is_LoginTypePWD") ?? "");

  const dispatch = useDispatch(); // REDUX

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();


  // NEW V2:
  useEffect(() => {
    

    let id = "";
    let pwd = "";

    switch (loginType) {
      case 0:
        id = "admin@example.com";
        pwd = "password";
        break;
      case 1:
        id = "";
        pwd = "";
        break;
      case 2:
        id = "admin@example.com";
        pwd = "password";
        break;
      case 3:
        id = "user@example.com";
        pwd = "password";
        break;
      case 4:
        id = "superadmin@example.com";
        pwd = "password";
        break;
      case 6:
        id = "admin@example.com";
        pwd = "1234567890";
        break;
      case 7:
        id = "admin@example.com";
        pwd = "1234567890";
        break;
      default:
        id = "";
        pwd = "";
    }

    // save AFTER computing
    localStorage.setItem("is_LoginTypeID", id);
    localStorage.setItem("is_LoginTypePWD", pwd);
    localStorage.setItem("is_LoginNavBar", String(loginType));  // ########## 

      
    const is_LoginTypeID = localStorage.getItem("is_LoginTypeID");
    const is_LoginTypePWD = localStorage.getItem("is_LoginTypePWD");
    const is_LoginNavBar = localStorage.getItem("is_LoginNavBar");
    

    log("========== src/components/Login: useEffect() -> Login Attr #####:", {    
      NavBarType: is_LoginNavBar,
      ID: is_LoginTypeID,
      PWD: is_LoginTypePWD
    });
     

    // log("AUTO LOGIN USING:", { id, pwd });

    if (loginType === 0 || loginType === 9 || loginType === 7) {
      if (!id || !pwd) {
          console.error("❌ Missing credentials");
          return;
      }
      if (id && pwd) {
          handleAutoLogin(id, pwd);
      }
      return;
    }

     // MANUAL LOGIN MODE (optional auto-fill only)
    setEmail(id);
    setPassword(pwd)

  }, [loginType]);


  const handleAutoLogin = async (autoEmail: string, autoPassword: string) => {
      try {
        const params = new URLSearchParams();
        params.append("username", autoEmail);
        params.append("password", autoPassword);

        log("🚀 Sending login:", autoEmail, autoPassword);

        // 20260425
        // ORIG
        // const url = `${import.meta.env.VITE_API_BASE}/token`;

        // TEST     
        const url = `${import.meta.env.VITE_FASTAPI}/token`;



        console.log("FINAL URL (AUTO LOGIN):", url);

        // NEW:
        const response = await axios.post<LoginResponse>(
          url,
          params,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        // OLD:
        // const response = await axios.post<LoginResponse>(
        //   `${import.meta.env.VITE_API_BASE}/api/token`,
        //   params,
        //   {
        //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //   }
        // );

        const userData = {
          name: response.data.username || autoEmail,
          email: autoEmail,
          is_admin: response.data.is_admin,
          is_level: response.data.is_level,
          token: response.data.access_token,
        };

        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", response.data.access_token);

        log("✅ AUTO LOGIN SUCCESS");

        // 20260426
        // ORIG
        // navigate("/menu");

        // TEST
        navigate("menu");

      } catch (err) {
        console.error("❌ AUTO LOGIN FAILED:", err);
      }
  };



  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {

      console.log("***** login email: ",email)
      console.log("***** login password: ",password)
        
        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);

        // DUMMY
        // const res = await axios.get(`${API_BASE_URL}/users`, {

        // Working
        // console.log("========== handleLogin -> VITE_API_BASE =", import.meta.env.VITE_API_BASE);

        // 20260426
        // const url = `${import.meta.env.VITE_API_BASE}/api/token`;  // DEBUG MODE: DEVT CONFIG
        // ORIG 
        // const url = `${import.meta.env.VITE_API_BASE}/token`;  // DEBUG MODE: IIS CONFIG

        // TEST 
        const url = `${import.meta.env.VITE_FASTAPI}/token`;


        console.log("FINAL URL (LOGIN):", url);

        // NEW
         const response = await axios.post<LoginResponse>(
        url,
        params,
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
        );

        // OLD
        // // "http://localhost:8000/api/token",
        // const response = await axios.post<LoginResponse>(
        // `${import.meta.env.VITE_API_BASE}/api/token`,
        // params,
        // {
        //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // }
        // );


         // Check Service.msc 
        // log("src/components/Login: Check1 ",  params )
        // log("src/components/Login: Check2 ", `${API_BASE_URL}`)
       
        // const response = await axios.post<LoginResponse>(
        // `${API_BASE_URL}/api/token`,
        // params,
        // {
        //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // }
        // );


        const userData = {
          name: response.data.username || email,
          email: email,
          is_admin: response.data.is_admin,
          is_level: response.data.is_level,
          token: response.data.access_token,
        };

        log("FINAL USER DATA:", userData);

        dispatch(setUser(userData));  // SAVE TO REDUX HERE
        localStorage.setItem("user", JSON.stringify(userData));   // SAVE TO localStorage
        localStorage.setItem("token", response.data.access_token); // ✅ FIX

        navigate("/menu");  // Redirect to dashboard

    } catch (err: any) {

        console.error("LOGIN ERROR:", err);

        if (err.response) {
          log("ERROR RESPONSE:", err.response.data);
        }

        setError("Invalid email or password");
    }
    
  };


  // const is_GLoginType = Number(localStorage.getItem("is_GLoginType"));

  const is_LoginTypeID = localStorage.getItem("is_LoginTypeID");
  const is_LoginTypePWD = localStorage.getItem("is_LoginTypePWD");
  const is_LoginNavBar = localStorage.getItem("is_LoginNavBar");
  
 
  //  GType: loginType,
  log("========== src/components/Login: React.FC() -> Login Attr #####:", {    
      NavBarType: is_LoginNavBar,
      ID: is_LoginTypeID,
      PWD: is_LoginTypePWD
  });


  if (loginType === 0 || loginType === 9) {  
    return <div>🔄 Logging in...</div>;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />&nbsp;

        {/* PASSWORD SETTINGS:        
              visible,      set type="password" 
              Not visible,  set type="hidden"
        */}

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />&nbsp;&nbsp;
        <button className="my-button" type="submit">Login</button>
      </form>
      {error && <p className="errMsg">{error}</p>}
    </div>
  );
};

export default Login;