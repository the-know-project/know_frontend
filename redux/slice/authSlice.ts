import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  user: Record<string, any> | null;
  role: string | null;
}

const initialState: GlobalState = {
  user: null,
  role: null,
};

const globalState = createSlice({
  name: "auth", 
  initialState,
  reducers: {
    mainUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.role = null;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
  },
});

export const { logOut, mainUser, setRole } = globalState.actions;

export default globalState.reducer;
