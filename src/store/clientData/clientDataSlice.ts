import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ClientState = {
  clientId: string;
  clientCpf: string;
};

const initialState = {
  clientId: "",
  clientCpf: "",
} as ClientState;

export const clientData = createSlice({
  name: "clientData",
  initialState,
  reducers: {
    setEditClientData: (
      state,
      action: PayloadAction<{
        clientId: string;
        clientCpf: string;
      }>
    ) => {
      state.clientId = action.payload.clientId;
      state.clientCpf = action.payload.clientCpf;
    },
  },
});

export const { setEditClientData } = clientData.actions;
export default clientData.reducer;
