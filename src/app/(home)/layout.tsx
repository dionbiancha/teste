"use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled, useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import Customizer from "./layout/shared/customizer/Customizer";
import HorizontalHeader from "./layout/horizontal/header/Header";
import { useSelector } from "@/store/hooks";
import { AppState } from "@/store/store";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  width: "100%",
  backgroundColor: "transparent",
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  return (
    <MainWrapper>
      <title>Modernize NextJs 14.0.3</title>
      <PageWrapper
        className="page-wrapper"
        sx={{
          ...(customizer.isCollapse && {
            [theme.breakpoints.up("lg")]: {
              ml: `${customizer.MiniSidebarWidth}px`,
            },
          }),
        }}
      >
        <HorizontalHeader />

        <Container
          sx={{
            maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
        <Customizer />
      </PageWrapper>
    </MainWrapper>
  );
}
