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
} from "./data";
import { useDispatch } from "@/store/hooks";
import { NEW_OR_USED } from "./data";
import { Steps } from "./page";
import {
  addVessel,
  deleteVessel,
  getListVessels,
  Vessels,
  VesselsList,
} from "@/service/vessels";
import { use, useEffect, useState } from "react";
import { IconDotsVertical } from "@tabler/icons-react";
import theme from "@/utils/theme";
import { showSnack } from "@/store/snack/snackSlice";
import { set } from "lodash";
import GenericDialog from "@/components/ui-components/dialog/GenericDialog";

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
  handleStep: (step: Steps) => void;
}

export default function VesselForm({ handleStep }: VesselFormProps) {
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
    defaultValues: DEFAULT_FORM_VESSEL,
  });
  const values = getValues();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [listVessels, setListVessels] = useState<VesselsList[]>();
  const [selected, setSelected] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAnyFieldEmpty =
    !values.model || !values.shipyard || !values.year || !values.newOrUsed;

  const onSubmit: SubmitHandler<Vessels> = async (data: Vessels) => {
    try {
      // if (id) {
      //   const res = await addVessel(data);
      //   console.log(res);
      //   return;
      // }
      if (clientData.clientId || id) {
        await addVessel({ ...data, cpf: clientData.clientCpf });

        reset();
        dispatch(
          showSnack({
            title: "Embarcação adicionada com sucesso!",
            type: "success",
          })
        );
        getListOfRegisteredVessels();
      }
    } catch (err: any) {
      //   if (err instanceof CpfAlreadyRegistered) {
      //     dispatch(
      //       showSnack({
      //         title: "CPF já cadastrado!",
      //         type: "error",
      //       })
      //     );
      //     cpfRef.current?.scrollIntoView({ behavior: "smooth" });
      //   }
      //   if (err instanceof EmailAlreadyRegistered) {
      //     dispatch(
      //       showSnack({
      //         title: "Email já cadastrado!",
      //         type: "error",
      //       })
      //     );
      //     emailRef.current?.scrollIntoView({ behavior: "smooth" });
      //   }
      // }
    }
  };

  async function getListOfRegisteredVessels() {
    if (!id && !clientData.clientId) return;

    try {
      const res = await getListVessels(id ?? clientData.clientId);
      setListVessels(res);
    } catch (err) {}
  }

  function isEmpty() {
    return listVessels?.length === 0;
  }

  async function handleDeleteVessel() {
    try {
      if (!selected) return;
      setShowDialog(false);

      await deleteVessel(selected);
      getListOfRegisteredVessels();
      dispatch(
        showSnack({
          title: "Embarcação deletada com sucesso!",
          type: "success",
        })
      );
    } catch (err) {}
  }

  useEffect(() => {
    getListOfRegisteredVessels();
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
          handleConfirm={() => handleDeleteVessel()}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          spacing={5}
          sx={{ minHeight: "calc(100vh - 170px)", marginTop: "30px" }}
        >
          <DashboardCard title="Embarcação">
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
                          field.onChange(e.target.value);
                        }}
                      />
                    )}
                  />
                </Box>
                <Box width={"100%"}>
                  <CustomFormLabel htmlFor="shipyard">
                    Estaleiro
                  </CustomFormLabel>
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
                  <CustomFormLabel htmlFor="length">
                    Comprimento
                  </CustomFormLabel>
                  <Controller
                    name="length"
                    control={control}
                    render={({ field }) => (
                      <>
                        <CustomSelect {...field} fullWidth variant="outlined">
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
              <DashboardCard title="Embarcações cadastradas">
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
                        {listVessels?.map((row: VesselsList, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={index}>
                              <TableCell>
                                <Typography>{row.model}</Typography>
                              </TableCell>

                              <TableCell>
                                <Typography>{row.year}</Typography>
                              </TableCell>

                              <TableCell>
                                <Typography>{row.newOrUsed}</Typography>
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
                  onClick={() => handleStep(Steps.ENGINE)}
                >
                  {id ? "Atualizar" : "Próximo"}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </form>
    </>
  );
}
