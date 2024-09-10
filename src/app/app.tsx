"use client";
import React from "react";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import RTL from "@/app/(home)/layout/shared/customizer/RTL";
import { ThemeSettings } from "@/utils/theme/Theme";
import { useSelector } from "react-redux";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { AppState } from "@/store/store";
import "@/utils/i18n";
import Snack from "@/components/ui-components/snack";
import Loading from "./loading";

const MyApp = ({ children }: { children: React.ReactNode }) => {
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <RTL direction={customizer.activeDir}>
            <Loading />
            <Snack />
            <CssBaseline />
            {children}
          </RTL>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </>
  );
};

export default MyApp;
