"use client";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  FormHelperText,
  MenuItem,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";
import DashboardCard from "../../components/shared/DashboardCard";
import CustomFormLabel from "../../components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import CustomSelect from "../../components/forms/theme-elements/CustomSelect";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  YEAR,
  LENGTH,
  BUILDING_MATERIAL,
  DEFAULT_FORM_VESSEL,
  headCells,
  DEFAULT_FORM_ENGINE,
} from "./data";
import { useDispatch } from "@/store/hooks";
import { NEW_OR_USED } from "./data";
import { Vessels, VesselsList } from "@/service/vessels";
import { use, useEffect, useState } from "react";

import GenericDialog from "@/components/ui-components/dialog/GenericDialog";
import EngineForm from "./engine";
import {
  Engine,
  EnginesList,
  getListEngines,
  updateEngine,
} from "@/service/engine";

export type Order = "asc" | "desc";

export function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            <TableSortLabel>{headCell.label}</TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface VesselFormProps {
  setVessels: (vessels: Vessels) => void;
  remove: () => void;
  add: () => void;
  isEdit?: boolean;
  finishEdit?: () => void;
  vessel: VesselsList | undefined;
  handleSubmit: (data: Vessels) => void;
}

export default function VesselForm({
  remove,
  vessel,
  finishEdit,
  isEdit,
  add,
  setVessels,
  handleSubmit,
}: VesselFormProps) {
  const clientData = useSelector((state: AppState) => state.clientData);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {
    control,
    clearErrors,

    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur", // Valida no onBlur e no submit,
    defaultValues: DEFAULT_FORM_VESSEL,
  });
  const values = getValues();
  const [engineForms, setEngineForms] = useState<EnginesList[]>([
    DEFAULT_FORM_ENGINE,
  ]);
  const [showDialog, setShowDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const isAnyFieldEmpty =
    !values.model || !values.shipyard || !values.year || !values.newOrUsed;

  const addEngineForm = () => {
    setEngineForms([
      ...engineForms,
      { ...DEFAULT_FORM_ENGINE, id: `${engineForms.length + 1}` },
    ]);
  };

  const removeEngineForm = (id: string) => {
    setEngineForms(engineForms.filter((engineForm) => engineForm.id !== id));
  };

  async function getListOfRegisteredEngines() {
    if (!id && vessel?.id) return;

    try {
      const res = await getListEngines(vessel?.id ?? "");
      setEngineForms(res);
    } catch (err) {}
  }

  async function handleUpdateEngine() {
    try {
      const res = await updateEngine(engineForms);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setVessels && !isEdit && setVessels({ ...values, engines: engineForms });
  }, [engineForms]);

  useEffect(() => {
    if (isEdit) {
      setShowEdit(true);
      reset(vessel);
      getListOfRegisteredEngines();
    } else {
      setShowEdit(false);
      reset(DEFAULT_FORM_VESSEL);
      setEngineForms([DEFAULT_FORM_ENGINE]);
    }
  }, [isEdit]);

  return (
    <>
      {showDialog && (
        <GenericDialog
          cancelText="Voltar"
          confirmText="Deletar"
          title="Tem certeza que deseja continuar?"
          content="Ao continuar, você irá deletar o cadastro selecionado."
          handleCancel={() => setShowDialog(false)}
          handleConfirm={() => {}}
        />
      )}
      <DashboardCard title="Embarcação">
        <>
          <Stack mb={3}>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="model">Modelo *</CustomFormLabel>
                <Controller
                  name="model"
                  control={control}
                  rules={{
                    required: "O nome é obrigatório",
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="model"
                      variant="outlined"
                      fullWidth
                      onFocus={() => clearErrors("model")}
                      error={errors.model}
                      helperText={errors.model?.message}
                      value={field?.value}
                      onChange={(e: any) => {
                        setVessels({ ...values, model: e.target.value });
                        field.onChange(e.target.value);
                      }}
                    />
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="shipyard">Estaleiro</CustomFormLabel>
                <Controller
                  name="shipyard"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      id="shipyard"
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        inputMode: "text",
                        pattern: "[0-9.-]*",
                      }}
                      onChange={(e: any) => {
                        setVessels({ ...values, shipyard: e.target.value });
                        field.onChange(e.target.value);
                      }}
                      value={field.value}
                    />
                  )}
                />
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="buildingMaterial">
                  Material de construção
                </CustomFormLabel>
                <Controller
                  name="buildingMaterial"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      fullWidth
                      variant="outlined"
                      onChange={(e: any) => {
                        setVessels({
                          ...values,
                          buildingMaterial: e.target.value,
                        });
                        field.onChange(e.target.value);
                      }}
                      sx={{
                        mb: 2,
                      }}
                    >
                      {BUILDING_MATERIAL.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="year">Ano *</CustomFormLabel>
                <Controller
                  name="year"
                  control={control}
                  rules={{
                    required: "O ano é obrigatório",
                  }}
                  render={({ field }) => (
                    <>
                      <CustomSelect
                        {...field}
                        fullWidth
                        variant="outlined"
                        error={!!errors.year}
                        onFocus={() => clearErrors("year")}
                        onChange={(e: any) => {
                          setVessels({ ...values, year: e.target.value });
                          field.onChange(e.target.value);
                        }}
                      >
                        {YEAR.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                      {errors.year && (
                        <FormHelperText error sx={{ marginLeft: 2 }}>
                          {errors.year.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={5}>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="newOrUsed">
                  Novo ou usado *
                </CustomFormLabel>
                <Controller
                  name="newOrUsed"
                  control={control}
                  rules={{
                    required: "Campo obrigatório",
                  }}
                  render={({ field }) => (
                    <>
                      <CustomSelect
                        {...field}
                        fullWidth
                        variant="outlined"
                        error={!!errors.newOrUsed}
                        onFocus={() => clearErrors("newOrUsed")}
                        onChange={(e: any) => {
                          setVessels({ ...values, newOrUsed: e.target.value });
                          field.onChange(e.target.value);
                        }}
                      >
                        {NEW_OR_USED.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                      {errors.newOrUsed && (
                        <FormHelperText error sx={{ marginLeft: 2 }}>
                          {errors.newOrUsed.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </Box>
              <Box width={"100%"}>
                <CustomFormLabel htmlFor="length">Comprimento</CustomFormLabel>
                <Controller
                  name="length"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CustomSelect
                        {...field}
                        fullWidth
                        variant="outlined"
                        onChange={(e: any) => {
                          setVessels({ ...values, length: e.target.value });
                          field.onChange(e.target.value);
                        }}
                      >
                        {LENGTH.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </>
                  )}
                />
              </Box>
            </Stack>
            <Stack
              alignItems={"end"}
              flexDirection="row"
              justifyContent={"space-between"}
              mt={5}
            >
              {!showEdit && (
                <Button
                  sx={{ width: "100%" }}
                  variant="text"
                  color="primary"
                  onClick={add}
                >
                  Adicionar embarcação
                </Button>
              )}
            </Stack>
          </Stack>

          {engineForms.map((engineForm, index) => (
            <div key={engineForm.id}>
              <EngineForm
                engine={engineForm}
                setEngines={(data) => {
                  setEngineForms((prevForms) =>
                    prevForms.map((form, i) =>
                      i === index
                        ? { ...form, ...data, cpf: clientData.clientCpf }
                        : form
                    )
                  );
                }}
                isNotUnique={engineForms?.length > 1}
                remove={() => removeEngineForm(engineForm.id ?? "")}
              />
            </div>
          ))}
          <Button
            sx={{ width: "100%", marginTop: "50px" }}
            variant="text"
            color="primary"
            onClick={addEngineForm}
          >
            Adicionar motor
          </Button>
        </>
      </DashboardCard>
      <Stack
        alignItems={"end"}
        flexDirection="row"
        justifyContent={"space-between"}
        my={5}
      >
        {showEdit && (
          <>
            <Button
              sx={{ width: "300px", height: "60px" }}
              size="large"
              onClick={() => {
                reset(DEFAULT_FORM_VESSEL);
                setShowEdit(false);
                finishEdit && finishEdit();
              }}
              variant="contained"
              color="error"
            >
              Cancelar
            </Button>

            <Button
              sx={{ width: "300px", height: "60px" }}
              size="large"
              onClick={() => {
                handleUpdateEngine();
                handleSubmit(values);
              }}
              variant="contained"
              color="primary"
              disabled={isAnyFieldEmpty}
            >
              Salvar
            </Button>
          </>
        )}
      </Stack>
    </>
  );
}
