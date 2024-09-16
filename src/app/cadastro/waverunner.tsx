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
  headWaveRunnerCells,
  NEW_OR_USED,
  BRAND_WAVERUNNER,
  DEFAULT_FORM_WAVERUNNER,
} from "./data";
import { useDispatch } from "@/store/hooks";
import { Steps } from "./data";
import { use, useEffect, useState } from "react";
import { IconDotsVertical } from "@tabler/icons-react";
import theme from "@/utils/theme";
import { showSnack } from "@/store/snack/snackSlice";
import GenericDialog from "@/components/ui-components/dialog/GenericDialog";
import {
  addWaveRunner,
  allWaveRunners,
  deleteWaveRunner,
  getListWaveRunners,
  updateWaveRunner,
  WaveRunner,
  WaveRunnerList,
  WaveRunnerModel,
} from "@/service/waverunner";
import { update } from "lodash";

export type Order = "asc" | "desc";

export function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headWaveRunnerCells.map((headCell) => (
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

export default function WaveRunnerForm({ handleStep }: VesselFormProps) {
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
    defaultValues: DEFAULT_FORM_WAVERUNNER,
  });
  const values = getValues();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [listWaveRunners, setListWaveRunners] = useState<WaveRunnerList[]>();
  const [selected, setSelected] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modelList, setModelList] = useState<WaveRunnerModel>();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAnyFieldEmpty =
    !values.brand ||
    !values.model ||
    !values.year ||
    !values.year ||
    !values.newOrUsed;

  const onSubmit: SubmitHandler<WaveRunner> = async (data: WaveRunner) => {
    try {
      if ((clientData.clientId || id) && !showEdit) {
        await addWaveRunner({ ...data, cpf: clientData.clientCpf });

        dispatch(
          showSnack({
            title: "Jetski adicionado com sucesso!",
            type: "success",
          })
        );
      }
      if (showEdit) {
        await updateWaveRunner({ ...data, id: selected ?? "" });
        dispatch(
          showSnack({
            title: "Dados atualizados com sucesso!",
            type: "success",
          })
        );
        setShowEdit(false);
      }

      reset(DEFAULT_FORM_WAVERUNNER);
      getListOfRegisteredWaveRunner();
    } catch (err: any) {}
  };

  async function getListOfRegisteredWaveRunner() {
    if (!id && !clientData.clientId) return;

    try {
      const res = await getListWaveRunners(id ?? clientData.clientId);
      setListWaveRunners(res);
    } catch (err) {}
  }

  async function getListModelWaveRunners() {
    try {
      const res = await allWaveRunners();
      setModelList(res[0]);
    } catch (err) {}
  }

  function isEmpty() {
    return listWaveRunners?.length === 0;
  }

  async function handleDeleteEngine() {
    try {
      if (!selected) return;
      setShowDialog(false);

      await deleteWaveRunner(selected);
      getListOfRegisteredWaveRunner();
      dispatch(
        showSnack({
          title: "Jetski deletado com sucesso!",
          type: "success",
        })
      );
    } catch (err) {}
  }

  const goToHome = () => {
    router.push("/");
  };

  useEffect(() => {
    getListOfRegisteredWaveRunner();
    getListModelWaveRunners();
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
          <DashboardCard title="Jetski">
            <Stack mb={3}>
              <Stack direction={"row"} spacing={5}>
                <Box width={"100%"}>
                  <CustomFormLabel htmlFor="brand">Marca *</CustomFormLabel>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        fullWidth
                        variant="outlined"
                        value={field?.value}
                        onChange={(e: any) => {
                          field.onChange(e.target.value);
                        }}
                        sx={{
                          mb: 2,
                        }}
                      >
                        {BRAND_WAVERUNNER.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    )}
                  />
                </Box>

                <Box width={"100%"}>
                  <CustomFormLabel htmlFor="model">Modelo *</CustomFormLabel>
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
                        {modelList?.waveRunners?.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    )}
                  />
                </Box>
              </Stack>
              <Stack direction={"row"} spacing={5}>
                <Box width={"100%"}>
                  <CustomFormLabel htmlFor="year">Ano *</CustomFormLabel>
                  <Controller
                    name="year"
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
                      reset(DEFAULT_FORM_WAVERUNNER);
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
              <DashboardCard title="Jetski's cadastrados">
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
                        {listWaveRunners?.map((row: WaveRunnerList, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={index}>
                              <TableCell>
                                <Typography>{row.model}</Typography>
                              </TableCell>

                              <TableCell>
                                <Typography>{row.brand}</Typography>
                              </TableCell>

                              <TableCell>
                                <Typography>{row.year}</Typography>
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
                                      setShowEdit(true);
                                      reset(
                                        listWaveRunners?.find(
                                          (e) => e.id === selected
                                        )
                                      );
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
                  onClick={() =>
                    id ? goToHome() : handleStep(Steps.TYPE_VESSEL)
                  }
                  variant="contained"
                  color="inherit"
                >
                  Voltar
                </Button>
                {!id && (
                  <Button
                    sx={{ width: "300px", height: "60px" }}
                    size="large"
                    variant="contained"
                    color="primary"
                    disabled={isEmpty()}
                    onClick={() => {
                      dispatch(
                        showSnack({
                          title: "Cadastro efetuado com sucesso!",
                          type: "success",
                        })
                      );
                      goToHome();
                    }}
                  >
                    Finalizar
                  </Button>
                )}
              </Stack>
            </>
          )}
        </Stack>
      </form>
    </>
  );
}
