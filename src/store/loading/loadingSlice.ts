import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LoadingState = {
  show: boolean;
};

const initialState = {
  show: false,
} as LoadingState;

export const loading = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.show = true;
    },
    hideLoading: () => initialState,
  },
});

export const { showLoading, hideLoading } = loading.actions;
export default loading.reducer;
