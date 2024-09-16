import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CounterState = {
  show: boolean;
  title: string;
  subtitle?: string;
  type: "success" | "error" | "warning" | "info";
};

const initialState = {
  show: false,
} as CounterState;

export const snack = createSlice({
  name: "snack",
  initialState,
  reducers: {
    showSnack: (
      state,
      action: PayloadAction<{
        title: string;
        subtitle?: string;
        type: "success" | "error" | "warning" | "info";
      }>
    ) => {
      state.show = true;
      state.title = action.payload.title;
      state.subtitle = action.payload.subtitle;
      state.type = action.payload.type;
    },
    hideSnack: () => initialState,
  },
});

export const { showSnack, hideSnack } = snack.actions;
export default snack.reducer;
