"use client";
import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  FormHelperText,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import DashboardCard from "../../components/shared/DashboardCard";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../components/forms/theme-elements/CustomSelect";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { validateName } from "@/utils/validate";
import { formatCPF, formatZipCode } from "@/utils/mask";
import {
  DEFAULT_FORM_VALUES,
  GENDER,
  MARITAL_STATUS,
  PUBLIC_PLACE,
  STATES,
} from "./data";
import {
  Client,
  CpfAlreadyRegistered,
  EmailAlreadyRegistered,
  getClient,
  newClient,
  updateClient,
} from "@/service/client";
import { showSnack } from "@/store/snack/snackSlice";
import { useDispatch } from "@/store/hooks";
import { Steps } from "./page";
import { set } from "lodash";
import { setEditClientData } from "@/store/clientData/clientDataSlice";

interface ClientFormProps {
  handleStep: (step: Steps) => void;
}

export default function ClientForm({ handleStep }: ClientFormProps) {
  const dispatch = useDispatch();
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
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const cpfRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [idClient, setIdClient] = useState<string | null>(null);

  const goToHome = () => {
    router.push("/");
  };

  const onSubmit: SubmitHandler<Client> = async (data: Client) => {
    try {
      if (id) {
        await updateClient(data);
        dispatch(
          showSnack({
            title: "Atualizado com sucesso!",
            type: "success",
          })
        );
        return;
      }
      if (!idClient) {
        const res = await newClient(data);
        setIdClient(res.id);
        dispatch(
          setEditClientData({
            clientId: res.id,
            clientCpf: data.cpf,
          })
        );
      }

      handleStep(Steps.TYPE_VESSEL);
    } catch (err: any) {
      if (err instanceof CpfAlreadyRegistered) {
        dispatch(
          showSnack({
            title: "CPF já cadastrado!",
            type: "error",
          })
        );

        cpfRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      if (err instanceof EmailAlreadyRegistered) {
        dispatch(
          showSnack({
            title: "Email já cadastrado!",
            type: "error",
          })
        );
        emailRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const values = getValues();
  const isAnyFieldEmpty =
    !values.name ||
    !values.cpf ||
    !values.birthdate ||
    !values.gender ||
    !values.email ||
    !values.cellPhone;

  async function handleGetClient() {
    if (!id) return;
    try {
      const res = await getClient(id);

      dispatch(
        setEditClientData({
          clientId: res.id ?? "",
          clientCpf: res.cpf,
        })
      );
      reset(res);
    } catch (err) {
      dispatch(
        showSnack({
          title: "Cliente inválido!",
          type: "error",
        })
      );
      goToHome();
    }
  }

  useEffect(() => {
    handleGetClient();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        ref={cpfRef}
        spacing={5}
        sx={{ minHeight: "calc(100vh - 170px)", marginTop: "30px" }}
      >
        <DashboardCard title="Dados pessoais">
          <Stack mb={3}>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="name">
                  Nome completo *
                </CustomFormLabel>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    validate: validateName,
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="name"
                      variant="outlined"
                      fullWidth
                      onFocus={() => clearErrors("name")}
                      error={errors.name}
                      helperText={errors.name?.message}
                      value={field?.value}
                      onChange={(e: any) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="cpf">CPF *</CustomFormLabel>
                <Controller
                  name="cpf"
                  control={control}
                  rules={{
                    required: "O CPF é obrigatório",
                    validate: {
                      validCPF: (value) => {
                        return value.length === 14 ? true : "CPF inválido";
                      },
                    },
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="cpf"
                      variant="outlined"
                      fullWidth
                      onFocus={() => clearErrors("cpf")}
                      error={!!errors.cpf}
                      helperText={errors.cpf?.message}
                      inputProps={{
                        inputMode: "text",
                        pattern: "[0-9.-]*",
                      }}
                      onChange={(e: any) => {
                        field.onChange(formatCPF(e.target.value));
                      }}
                      value={formatCPF(field.value)}
                    />
                  )}
                />
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="birthdate">
                  Data de nascimento *
                </CustomFormLabel>
                <Controller
                  name="birthdate"
                  control={control}
                  rules={{ required: "Data de nascimento é obrigatória" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="birthdate"
                      variant="outlined"
                      fullWidth
                      type="date"
                      onFocus={() => clearErrors("birthdate")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.birthdate}
                      helperText={
                        errors.birthdate ? errors.birthdate.message : ""
                      }
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="maritalStatus">
                  Estado civil
                </CustomFormLabel>
                <Controller
                  name="maritalStatus"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      fullWidth
                      id="select-marital-status"
                      variant="outlined"
                      sx={{
                        mb: 2,
                      }}
                    >
                      {MARITAL_STATUS.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="gender">Sexo *</CustomFormLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{
                    required: "O Sexo é obrigatório",
                  }}
                  render={({ field }) => (
                    <>
                      <CustomSelect
                        {...field}
                        fullWidth
                        variant="outlined"
                        error={!!errors.gender}
                        onFocus={() => clearErrors("gender")}
                      >
                        {GENDER.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                      {errors.gender && (
                        <FormHelperText error sx={{ marginLeft: 2 }}>
                          {errors.gender.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </Box>
            </Stack>
          </Stack>
        </DashboardCard>
        <DashboardCard title="Contato">
          <Stack mb={3} ref={emailRef}>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="email">E-mail *</CustomFormLabel>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "O e-mail é obrigatório",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "E-mail inválido",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="email"
                      onFocus={() => clearErrors("email")}
                      variant="outlined"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="phone">Celular *</CustomFormLabel>
                <Controller
                  name="cellPhone"
                  control={control}
                  rules={{
                    required: "O número de celular é obrigatório",
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="phone"
                      onFocus={() => clearErrors("cellPhone")}
                      variant="outlined"
                      onChange={(e: any) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                      }}
                      value={field.value}
                      fullWidth
                      error={!!errors.cellPhone}
                      helperText={errors.cellPhone?.message}
                    />
                  )}
                />
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="fixedPhone">
                  Telefone Fixo
                </CustomFormLabel>
                <Controller
                  name="fixedPhone"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      id="fixedPhone"
                      variant="outlined"
                      fullWidth
                      onChange={(e: any) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                      }}
                      value={field.value}
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="phone">
                  Telefone Comercial
                </CustomFormLabel>
                <Controller
                  name="comercialPhone"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      id="comercialPhone"
                      variant="outlined"
                      fullWidth
                      onChange={(e: any) => {
                        field.onChange(e.target.value.replace(/\D/g, ""));
                      }}
                      value={field.value}
                    />
                  )}
                />
              </Box>
            </Stack>
          </Stack>
        </DashboardCard>
        <DashboardCard title="Endereço">
          <Stack mb={3}>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="zipCode">CEP</CustomFormLabel>
                <Controller
                  name="zipCode"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="zipCode"
                      variant="outlined"
                      fullWidth
                      onFocus={() => clearErrors("zipCode")}
                      error={!!errors.zipCode}
                      helperText={errors.zipCode?.message}
                      inputProps={{
                        inputMode: "text",
                        pattern: "[0-9.-]*",
                      }}
                      onChange={(e: any) => {
                        field.onChange(formatZipCode(e.target.value));
                      }}
                      value={formatZipCode(field.value ?? "")}
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="publicPlace">
                  Tipo de logadouro
                </CustomFormLabel>
                <Controller
                  name="publicPlace"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      fullWidth
                      variant="outlined"
                      sx={{
                        mb: 2,
                      }}
                    >
                      {PUBLIC_PLACE.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="address">Logadouro</CustomFormLabel>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="address"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="state">Estado</CustomFormLabel>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      fullWidth
                      id="select-state"
                      variant="outlined"
                      sx={{
                        mb: 2,
                      }}
                    >
                      {STATES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="city">Cidade</CustomFormLabel>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="city"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="neighborhood">Bairro</CustomFormLabel>
                <Controller
                  name="neighborhood"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="neighborhood"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="number">Número</CustomFormLabel>

                <Controller
                  name="number"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="number"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="complement">
                  Complemento
                </CustomFormLabel>
                <Controller
                  name="complement"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="complement"
                      variant="outlined"
                      fullWidth
                    />
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
            onClick={goToHome}
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
            {id ? "Atualizar" : "Próximo"}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
