"use client";
import React from "react";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "@/app/(home)/layout/shared/customizer/RTL";
import { ThemeSettings } from "@/utils/theme/Theme";
import { useSelector } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AppState } from "@/store/store";
import Snack from "@/components/ui-components/snack";
import Loading from "./loading";
import Dashboard from "./(home)/page";

const MyApp = ({ children }: { children: React.ReactNode }) => {
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <>
      <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <Loading />
          <Snack />
          <CssBaseline />
          {children}
        </RTL>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
