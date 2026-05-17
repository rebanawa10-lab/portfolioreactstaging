// file: src/components/store/uiSlice.ts


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  iconBlue: {
    color: string;
  };
  DataGridIcon: {
    color: string;
  };
  DataGridIconEdit: {
    color: string;
  };
   DataGridIconDelete: {
    color: string;
  };
   DataGridIconPassword: {
    color: string;
  };
}

const initialState: UiState = {
  iconBlue: {
    color: "rgb(99, 120, 243)",
  },
  DataGridIcon: {
    color: "rgb(99, 120, 243)",
  },
  DataGridIconEdit: {
    color: "rgb(99, 120, 243)",
  },
  DataGridIconDelete: {
    color: "rgb(99, 120, 243)", 
    // RED -> "rgb(253, 0, 0)",
    // BLUE -> color: "rgb(99, 120, 243)",
  },
  DataGridIconPassword: {
    color: "rgb(99, 120, 243)",
  },

};



const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIconBlue: (state, action: PayloadAction<string>) => {
      state.iconBlue.color = action.payload;
    },
    setDataGridIcon: (state, action: PayloadAction<string>) => {
      state.iconBlue.color = action.payload;
    },
    setDataGridIconEdit: (state, action: PayloadAction<string>) => {
      state.iconBlue.color = action.payload;
    },
    setDataGridIconDelete: (state, action: PayloadAction<string>) => {
      state.iconBlue.color = action.payload;
    },
    setDataGridIconPassword: (state, action: PayloadAction<string>) => {
      state.iconBlue.color = action.payload;
    },
  },
});

export const { setIconBlue, setDataGridIcon} = uiSlice.actions;
export default uiSlice.reducer;