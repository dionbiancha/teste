"use client";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
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
import { Steps } from "./page";
import { use, useEffect, useState } from "react";
import { IconDotsVertical } from "@tabler/icons-react";
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
} from "@/service/engine";

export type Order = "asc" | "desc";

export function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headMotorsCells.map((headCell) => (
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
  handleStep: (step: Steps) => void;
}

export default function EngineForm({ handleStep }: VesselFormProps) {
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
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAnyFieldEmpty =
    !values.modelType ||
    !values.model ||
    !values.power ||
    !values.year ||
    !values.saleDate ||
    !values.typeOfFuel ||
    !values.leisureOrCommercial;

  const onSubmit: SubmitHandler<Engine> = async (data: Engine) => {
    try {
      if (clientData.clientId || id) {
        await addEngine({ ...data, cpf: clientData.clientCpf });

        reset();
        dispatch(
          showSnack({
            title: "Motor adicionado com sucesso!",
            type: "success",
          })
        );
        getListOfRegisteredEngines();
      }
    } catch (err: any) {}
  };

  async function getListOfRegisteredEngines() {
    if (!id && !clientData.clientId) return;

    try {
      const res = await getListEngines(id ?? clientData.clientId);
      setListEngines(res);
    } catch (err) {}
  }

  async function getListModelEngine() {
    try {
      const res = await allEngines();
      setModelList(res);
    } catch (err) {}
  }

  function isEmpty() {
    return listEngines?.length === 0;
  }

  async function handleDeleteEngine() {
    try {
      if (!selected) return;
      setShowDialog(false);

      await deleteEngine(selected);
      getListOfRegisteredEngines();
      dispatch(
        showSnack({
          title: "Motor deletado com sucesso!",
          type: "success",
        })
      );
    } catch (err) {}
  }

  const goToHome = () => {
    router.push("/");
  };

  useEffect(() => {
    getListOfRegisteredEngines();
    getListModelEngine();
  }, []);

  return (
    <>
      {showDialog && (
        <GenericDialog
          cancelText="Voltar"
          confirmText="Deletar"
          title="Tem certeza que deseja continuar?"
          content="Ao continuar, você irá deletar o cadastro selecionado."
          handleCancel={() => setShowDialog(false)}
          handleConfirm={() => handleDeleteEngine()}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={5}
          sx={{ minHeight: "calc(100vh - 170px)", marginTop: "30px" }}
        >
          <DashboardCard title="Motor">
            <Stack mb={3}>
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
                  <CustomFormLabel htmlFor="model">
                    Marca/Modelo *
                  </CustomFormLabel>
                  <Controller
                    name="model"
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
                          field.onChange(e.target.value);
                        }}
                      />
                    )}
                  />
                </Box>
                <Box width={"100%"}>
                  <CustomFormLabel htmlFor="serial">
                    Chassi/Serial
                  </CustomFormLabel>
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
                        error={!!errors.saleDate}
                        helperText={
                          errors.saleDate ? errors.saleDate.message : ""
                        }
                      />
                    )}
                  />
                </Box>
                <Box width={"100%"}>
                  <CustomFormLabel htmlFor="invoice">
                    Nota fiscal
                  </CustomFormLabel>
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
                        }}
                        value={field.value}
                      />
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
                {showEdit ? (
                  <Button
                    sx={{ width: "100px" }}
                    onClick={() => {
                      reset();
                      setShowEdit(false);
                    }}
                    variant="contained"
                    color="error"
                  >
                    Cancelar
                  </Button>
                ) : (
                  <Box />
                )}
                <Button
                  sx={{ width: "100px" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isAnyFieldEmpty}
                >
                  {showEdit ? "Atualizar" : "Adicionar"}
                </Button>
              </Stack>
            </Stack>
          </DashboardCard>
          {!showEdit && (
            <>
              <DashboardCard title="Motores cadastrados">
                <Paper
                  variant="outlined"
                  sx={{ mt: 5, border: `1px solid ${borderColor}` }}
                >
                  <TableContainer>
                    <Table
                      sx={{ minWidth: 750 }}
                      aria-labelledby="tableTitle"
                      size={"medium"}
                    >
                      <EnhancedTableHead />
                      <TableBody>
                        {listEngines?.map((row: EnginesList, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={index}>
                              <TableCell>
                                <Typography>{row.model}</Typography>
                              </TableCell>

                              <TableCell>
                                <Typography>{row.year}</Typography>
                              </TableCell>

                              <TableCell>
                                <Typography>{row.power}</Typography>
                              </TableCell>
                              <TableCell>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      setSelected(row.id);
                                      handleClick(e);
                                    }}
                                  >
                                    <IconDotsVertical size="1.1rem" />
                                  </IconButton>
                                </Tooltip>
                                <Menu
                                  id="basic-menu"
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                  MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                  }}
                                >
                                  <MenuItem
                                    onClick={() => {
                                      reset(row);
                                      setShowEdit(true);
                                      handleClose();
                                    }}
                                  >
                                    Editar
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      setShowDialog(true);
                                      handleClose();
                                    }}
                                  >
                                    Excluir
                                  </MenuItem>
                                </Menu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {isEmpty() && (
                      <Box sx={{ textAlign: "center", paddingY: "40px" }}>
                        {"Vazio"}
                      </Box>
                    )}
                  </TableContainer>
                </Paper>
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
                  onClick={() => handleStep(Steps.TYPE_VESSEL)}
                  variant="contained"
                  color="inherit"
                >
                  Voltar
                </Button>
                <Button
                  sx={{ width: "300px", height: "60px" }}
                  size="large"
                  variant="contained"
                  color="primary"
                  disabled={isEmpty()}
                  onClick={() => {
                    goToHome();
                  }}
                >
                  {id ? "Atualizar" : "Finalizar"}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </form>
    </>
  );
}
