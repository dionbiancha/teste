"use client";
import { useEffect, useRef, useState } from "react";
import PageContainer from "@/components/container/PageContainer";
import { useRouter, useSearchParams } from "next/navigation";

import HorizontalHeader from "../(home)/layout/horizontal/header/Header";
import {
  Box,
  Container,
  Step,
  StepButton,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";
import ClientForm from "../cadastro/client";
import TypeForm from "../cadastro/type";
import WaveRunnerForm from "../cadastro/waverunner";
import VesselForm from "../cadastro/vessel";
import EngineForm from "../cadastro/engine";
import { Steps } from "../cadastro/data";
import VesselAndEngineForm from "../cadastro/vesselAndEngine";

export default function Edit() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const customizer = useSelector((state: AppState) => state.customizer);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  const [steps, setSteps] = useState<string[]>([
    "Cliente",
    "Jetski",
    "Embarcação",
  ]);
  const [activeStep, setActiveStep] = useState<Steps>(Steps.CLIENT);

  function handleStep(step: number) {
    setActiveStep(step);
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <HorizontalHeader closeAction />

      <Container
        sx={{
          maxWidth: customizer.isLayout === "boxed" ? "lg" : "100%!important",
        }}
      >
        <Stepper
          sx={{ marginY: 6, marginX: "auto", maxWidth: "600px" }}
          activeStep={activeStep}
          alternativeLabel
          nonLinear
        >
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton
                color="inherit"
                disabled={!id}
                onClick={() => handleStep(index)}
              >
                <StepLabel>{label}</StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>

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
          <VesselAndEngineForm handleStep={(e) => handleStep(e)} />
        </Box>
      </Container>
    </PageContainer>
  );
}
