"use client";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

export default function Loading() {
  const loading = useSelector((state: AppState) => state.loading);

  if (!loading.show) return <></>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "absolute",
        zIndex: 9999,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
