"use client";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Divider,
  FormHelperText,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
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
  headMotorsCells,
  DEFAULT_FORM_ENGINE,
  FUEL,
  LEISURE_OR_COMMERCIAL,
} from "./data";
import { useDispatch } from "@/store/hooks";
import { Steps } from "./data";
import { use, useEffect, useState } from "react";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import theme from "@/utils/theme";
import { showSnack } from "@/store/snack/snackSlice";
import GenericDialog from "@/components/ui-components/dialog/GenericDialog";
import {
  addEngine,
  allEngines,
  deleteEngine,
  Engine,
  EngineModel,
  EnginesList,
  getListEngines,
  updateEngine,
} from "@/service/engine";
import { set } from "lodash";
import { fi } from "date-fns/locale";

interface EngineFormProps {
  setEngines: (engines: Engine) => void;
  remove: () => void;
  isNotUnique: boolean;
  engine: Engine;
}

export default function EngineForm(data: EngineFormProps) {
  const { remove, isNotUnique, setEngines, engine } = data;
  const clientData = useSelector((state: AppState) => state.clientData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useDispatch();
  const borderColor = theme.palette.divider;
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
    defaultValues: DEFAULT_FORM_ENGINE,
  });
  const values = getValues();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [listEngines, setListEngines] = useState<EnginesList[]>();
  const [selected, setSelected] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modelList, setModelList] = useState<EngineModel[]>([]);
  const [selectedTypeModel, setSelectedTypeModel] = useState<string | null>(
    null
  );

  const onSubmit: SubmitHandler<Engine> = async (data: Engine) => {
    try {
    } catch (err: any) {}
  };

  async function getListModelEngine() {
    try {
      const res = await allEngines();
      setModelList(res);
    } catch (err) {}
  }

  async function handleDeleteEngine() {
    try {
      remove();
      if (!engine) return;
      setShowDialog(false);

      await deleteEngine(engine.id ?? "");
      dispatch(
        showSnack({
          title: "Motor deletado com sucesso!",
          type: "success",
        })
      );
    } catch (err) {}
  }

  useEffect(() => {
    getListModelEngine();
  }, []);

  useEffect(() => {
    reset(engine);
  }, [engine]);

  return (
    <>
      {showDialog && (
        <GenericDialog
          cancelText="Voltar"
          confirmText="Remover"
          title="Tem certeza que deseja continuar?"
          content="Ao continuar, você irá remover o motor selecionado."
          handleCancel={() => setShowDialog(false)}
          handleConfirm={() => handleDeleteEngine()}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <Divider sx={{ mb: 5 }} /> */}
        <Stack
          mb={5}
          sx={{
            backgroundColor: "#f9f9f96f",
            width: "100%",
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h5">Motor</Typography>
            {isNotUnique && (
              <Button
                variant="text"
                color="error"
                onClick={() => setShowDialog(true)}
              >
                Remover
              </Button>
            )}
          </Stack>

          <Stack direction={"row"} spacing={5}>
            <Box width={"100%"}>
              <CustomFormLabel htmlFor="modelType">Tipo *</CustomFormLabel>
              <Controller
                name="modelType"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    fullWidth
                    variant="outlined"
                    value={field?.value}
                    onChange={(e: any) => {
                      setEngines({ ...values, modelType: e.target.value });
                      field.onChange(e.target.value);
                      setSelectedTypeModel(e.target.value);
                    }}
                    sx={{
                      mb: 2,
                    }}
                  >
                    {modelList.map((option, index) => (
                      <MenuItem key={index} value={option.type}>
                        {option.type}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                )}
              />
            </Box>

            <Box
              width={"100%"}
              sx={{ display: selectedTypeModel ? "block" : "none" }}
            >
              <CustomFormLabel htmlFor="model">Marca/Modelo *</CustomFormLabel>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    fullWidth
                    variant="outlined"
                    value={field.value}
                    onChange={(e: any) => {
                      field.onChange(e.target.value);
                      setEngines({ ...values, model: e.target.value });
                    }}
                    sx={{
                      mb: 2,
                    }}
                  >
                    {modelList.map(
                      (option) =>
                        selectedTypeModel === option.type &&
                        option.items.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {item}
                          </MenuItem>
                        ))
                    )}
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
                      value={field.value}
                      onChange={(e: any) => {
                        field.onChange(e.target.value);
                        setEngines({ ...values, year: e.target.value });
                      }}
                      onFocus={() => clearErrors("year")}
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
              <CustomFormLabel htmlFor="model">Potência *</CustomFormLabel>
              <Controller
                name="power"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    id="power"
                    variant="outlined"
                    fullWidth
                    onFocus={() => clearErrors("power")}
                    error={errors.power}
                    helperText={errors.power?.message}
                    value={field?.value}
                    onChange={(e: any) => {
                      setEngines({ ...values, power: e.target.value });
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </Box>
            <Box width={"100%"}>
              <CustomFormLabel htmlFor="serial">Chassi/Serial</CustomFormLabel>
              <Controller
                name="serial"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    id="serial"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      inputMode: "text",
                      pattern: "[0-9.-]*",
                    }}
                    onChange={(e: any) => {
                      setEngines({ ...values, serial: e.target.value });
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
              <CustomFormLabel htmlFor="typeOfFuel">
                Tipo de Combustível *
              </CustomFormLabel>
              <Controller
                name="typeOfFuel"
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
                      error={!!errors.typeOfFuel}
                      onFocus={() => clearErrors("typeOfFuel")}
                      value={field.value}
                      onChange={(e: any) => {
                        setEngines({ ...values, typeOfFuel: e.target.value });
                        field.onChange(e.target.value);
                      }}
                    >
                      {FUEL.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                    {errors.typeOfFuel && (
                      <FormHelperText error sx={{ marginLeft: 2 }}>
                        {errors.typeOfFuel.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Box>
            <Box width={"100%"}>
              <CustomFormLabel htmlFor="leisureOrCommercial">
                Tipo de uso *
              </CustomFormLabel>
              <Controller
                name="leisureOrCommercial"
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
                      error={!!errors.leisureOrCommercial}
                      onFocus={() => clearErrors("leisureOrCommercial")}
                      value={field.value}
                      onChange={(e: any) => {
                        setEngines({
                          ...values,
                          leisureOrCommercial: e.target.value,
                        });
                        field.onChange(e.target.value);
                      }}
                    >
                      {LEISURE_OR_COMMERCIAL.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                    {errors.leisureOrCommercial && (
                      <FormHelperText error sx={{ marginLeft: 2 }}>
                        {errors.leisureOrCommercial.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Box>
          </Stack>

          <Stack direction={"row"} spacing={5}>
            <Box width={"100%"}>
              <CustomFormLabel htmlFor="saleDate">
                Data de Venda *
              </CustomFormLabel>
              <Controller
                name="saleDate"
                control={control}
                rules={{ required: "Data de venda é obrigatória" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="birthdate"
                    variant="outlined"
                    fullWidth
                    type="date"
                    onFocus={() => clearErrors("saleDate")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={field.value}
                    onChange={(e: any) => {
                      setEngines({ ...values, saleDate: e.target.value });
                      field.onChange(e.target.value);
                    }}
                    error={!!errors.saleDate}
                    helperText={errors.saleDate ? errors.saleDate.message : ""}
                  />
                )}
              />
            </Box>
            <Box width={"100%"}>
              <CustomFormLabel htmlFor="invoice">Nota fiscal</CustomFormLabel>
              <Controller
                name="invoice"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    id="invoice"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      inputMode: "text",
                      pattern: "[0-9.-]*",
                    }}
                    onChange={(e: any) => {
                      field.onChange(e.target.value);
                      setEngines({ ...values, invoice: e.target.value });
                    }}
                    value={field.value}
                  />
                )}
              />
            </Box>
          </Stack>
        </Stack>
      </form>
    </>
  );
}
