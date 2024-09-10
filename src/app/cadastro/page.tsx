"use client";
import { useEffect, useRef, useState } from "react";
import PageContainer from "@/components/container/PageContainer";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "../(home)/layout/horizontal/navbar/Navigation";
import HorizontalHeader from "../(home)/layout/horizontal/header/Header";
import { Box, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";
import ClientForm from "./client";
import VesselForm from "./vessel";
import TypeForm from "./type";
import EngineForm from "./engine";
import WaveRunnerForm from "./waverunner";

export enum Steps {
  CLIENT = 0,
  JETSKI = 1,
  VESSEL = 2,
  ENGINE = 3,
  TYPE_VESSEL = 4,
}

export default function Register() {
  const customizer = useSelector((state: AppState) => state.customizer);
  const [activeStep, setActiveStep] = useState<Steps>(Steps.CLIENT);

  function handleStep(step: number) {
    setActiveStep(step);
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <HorizontalHeader closeAction />
      <Navigation />

      <Container
        sx={{
          maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
        }}
      >
        <Box sx={{ display: activeStep === Steps.CLIENT ? "block" : "none" }}>
          <ClientForm handleStep={(e) => handleStep(e)} />
        </Box>
        <Box
          sx={{ display: activeStep === Steps.TYPE_VESSEL ? "block" : "none" }}
        >
          <TypeForm handleStep={(e) => handleStep(e)} />
        </Box>
        <Box sx={{ display: activeStep === Steps.JETSKI ? "block" : "none" }}>
          <WaveRunnerForm handleStep={(e) => handleStep(e)} />
        </Box>
        <Box sx={{ display: activeStep === Steps.VESSEL ? "block" : "none" }}>
          <VesselForm handleStep={(e) => handleStep(e)} />
        </Box>
        <Box sx={{ display: activeStep === Steps.ENGINE ? "block" : "none" }}>
          <EngineForm handleStep={(e) => handleStep(e)} />
        </Box>
      </Container>
    </PageContainer>
  );
}
