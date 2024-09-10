"use client";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FormHelperText, MenuItem, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";
import DashboardCard from "../../components/shared/DashboardCard";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../components/forms/theme-elements/CustomSelect";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { DEFAULT_FORM_TYPE, TYPES } from "./data";
import { Steps } from "./page";

interface TypeFormProps {
  handleStep: (step: Steps) => void;
}

export default function TypeForm({ handleStep }: TypeFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur", // Valida no onBlur e no submit,
    defaultValues: DEFAULT_FORM_TYPE,
  });

  const goToHome = () => {
    router.push("/");
  };
  const values = getValues();

  const isAnyFieldEmpty = !values.type;

  return (
    <form
      onSubmit={handleSubmit(() => {
        if (values.type === "Jet Ski") {
          handleStep(Steps.JETSKI);
          return;
        }
        handleStep(Steps.VESSEL);
      })}
    >
      <Stack
        spacing={5}
        sx={{ minHeight: "calc(100vh - 170px)", marginTop: "30px" }}
      >
        <DashboardCard title="Tipo de embarcação">
          <Stack mb={3}>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="type">
                  Material de construção *
                </CustomFormLabel>
                <Controller
                  name="type"
                  control={control}
                  rules={{
                    required: "O material de construção é obrigatório",
                  }}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      fullWidth
                      variant="outlined"
                      error={!!errors.type}
                      onFocus={() => clearErrors("type")}
                      sx={{
                        mb: 2,
                      }}
                    >
                      {TYPES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                />
              </Box>
            </Stack>
          </Stack>
        </DashboardCard>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width="100%"
          pb="50px"
        >
          <Button
            sx={{ width: "300px", height: "60px" }}
            size="large"
            onClick={() => handleStep(Steps.CLIENT)}
            variant="contained"
            color="inherit"
          >
            Voltar
          </Button>
          <Button
            sx={{ width: "300px", height: "60px" }}
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            disabled={isAnyFieldEmpty}
          >
            {"Próximo"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
