// file:        src/components/store/userSlice.tsx


import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"; 
import { log } from "../config/debug";


interface UserState {
  name: string | null;
  email: string | null;
  is_admin: number;
  is_level: number;
  token: string | null;
}

const initialState: UserState = {
  name: localStorage.getItem("name"),
  email: localStorage.getItem("email"),
  is_admin: Number(localStorage.getItem("is_admin") ?? 0),
  is_level: Number(localStorage.getItem("is_level") ?? 0),
  token: localStorage.getItem("token"),
};

log("src/components/store/userSlice: Initial Redux State:", initialState);



const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      log("🔵 userSlice: setUser BEFORE:", { ...state });
      log("🟢 userSlice: setUser PAYLOAD:", action.payload);

      state.name = action.payload.name;
      state.email = action.payload.email;
      state.is_admin = action.payload.is_admin;
      state.is_level = action.payload.is_level;
      state.token = action.payload.token;

      // sync localStorage
      localStorage.setItem("name", action.payload.name ?? "");
      localStorage.setItem("email", action.payload.email ?? "");
      localStorage.setItem("is_admin", String(action.payload.is_admin));
      localStorage.setItem("is_level", String(action.payload.is_level));
      localStorage.setItem("token", action.payload.token ?? "");

      log("🟣 src/components/store/userSlice: setUser AFTER:", { ...state });

    },

    updateRole: (state, action: PayloadAction<{ is_admin: number; is_level: number; name: string }>) => {

      log("🔵 userSlice: updateRole BEFORE:", { ...state });
      log("🟢 userSlice: updateRole PAYLOAD:", action.payload);


      state.is_admin = action.payload.is_admin;
      state.is_level = action.payload.is_level;
      state.name = action.payload.name;

      localStorage.setItem("is_admin", String(action.payload.is_admin));
      localStorage.setItem("is_level", String(action.payload.is_level));
      localStorage.setItem("name", action.payload.name);

      log("🟣 src/components/store/userSlice: updateRole AFTER:", { ...state });
    },

    logout: (state) => {

      log("🔵 userSlice: logout BEFORE:", { ...state });
      state.name = null;
      state.email = null;
      state.token = null;
      state.is_admin = 0;
      state.is_level = 0;

      localStorage.clear();

      log("🟣 src/components/store/userSlice: logout AFTER:", { ...state });
    },
  },
});

export const { setUser, updateRole, logout } = userSlice.actions;
export default userSlice.reducer;