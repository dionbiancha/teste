"use client";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
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
import { useForm, SubmitHandler } from "react-hook-form";
import { DEFAULT_FORM_VESSEL, headCells } from "./data";
import { useDispatch } from "@/store/hooks";
import { NEW_OR_USED } from "./data";
import { Steps } from "./data";
import {
  addVessel,
  deleteVessel,
  getListVessels,
  updateVessel,
  Vessels,
  VesselsList,
} from "@/service/vessels";
import { use, useEffect, useState } from "react";
import { IconDotsVertical, IconPlus } from "@tabler/icons-react";
import theme from "@/utils/theme";
import { showSnack } from "@/store/snack/snackSlice";
import GenericDialog from "@/components/ui-components/dialog/GenericDialog";
import VesselForm from "./vessel";
import { set } from "lodash";

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
  handleStep: (e: Steps) => void;
}

export default function VesselAndEngineForm(data: VesselFormProps) {
  const { handleStep } = data;
  const clientData = useSelector((state: AppState) => state.clientData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useDispatch();
  const [vesselForms, setVesselForms] = useState<VesselsList[]>([
    DEFAULT_FORM_VESSEL,
  ]);
  const borderColor = theme.palette.divider;
  const {
    handleSubmit,
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
  const [listVessels, setListVessels] = useState<VesselsList[]>();
  const [selected, setSelected] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const addVesselForm = () => {
    setVesselForms([
      ...vesselForms,
      { ...DEFAULT_FORM_VESSEL, id: `${vesselForms.length + 1}` },
    ]);
  };

  const removeVesselForm = (id: string) => {
    setVesselForms(vesselForms.filter((vesselForm) => vesselForm.id !== id));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = async (data: Vessels) => {
    try {
      if ((clientData.clientId || id) && !showEdit) {
        await addVessel(vesselForms);

        dispatch(
          showSnack({
            title: "Cadastro efetuado com sucesso!",
            type: "success",
          })
        );
        goToHome();
        return;
      }

      if (showEdit) {
        await updateVessel({ ...data, id: selected ?? "" });
        dispatch(
          showSnack({
            title: "Dados atualizados com sucesso!",
            type: "success",
          })
        );
        setShowEdit(false);
      }

      reset(DEFAULT_FORM_VESSEL);
      getListOfRegisteredVessels();
    } catch (err: any) {
      dispatch(
        showSnack({
          title: "Algo deu errado, tente novamente!",
          type: "error",
        })
      );
    }
  };
  const goToHome = () => {
    router.push("/");
  };
  async function getListOfRegisteredVessels() {
    if (!id && !clientData.clientId) return;

    try {
      const res = await getListVessels(id ?? clientData.clientId);
      console.log(res);
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
          {vesselForms?.map((vesselForm, index) => (
            <div key={vesselForm.id}>
              <VesselForm
                handleSubmit={(e) => onSubmit(e)}
                vessel={listVessels?.find((e) => e.id === selected)}
                isEdit={showEdit}
                finishEdit={() => setShowEdit(false)}
                remove={() => removeVesselForm(vesselForm.id ?? "")}
                add={addVesselForm}
                setVessels={(data) => {
                  setVesselForms((prevForms) =>
                    prevForms.map((form, i) =>
                      i === index
                        ? { ...form, ...data, cpf: clientData.clientCpf }
                        : form
                    )
                  );
                }}
              />
            </div>
          ))}

          {!showEdit && (
            <>
              {id && (
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
                                        reset(
                                          listVessels?.find(
                                            (e) => e.id === selected
                                          )
                                        );
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
              )}

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

                <Button
                  sx={{ width: "300px", height: "60px" }}
                  size="large"
                  variant="contained"
                  color="primary"
                  type="submit"
                  // disabled={isEmpty()}
                >
                  {id ? "Adicionar" : "Cadastrar"}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </form>
    </>
  );
}
