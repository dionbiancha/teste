import * as React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconDotsVertical } from "@tabler/icons-react";
import DashboardCard from "@/components/shared/DashboardCard";
import { Menu, MenuItem, Skeleton } from "@mui/material";
import {
  ClientList,
  ClientListObject,
  deleteClient,
  listClients,
} from "@/service/client";
import { useRouter } from "next/navigation";
import { EnhancedTableHead, Order } from "./EnhancedTableHead";
import { EnhancedTableToolbar } from "./EnhancedTableToolbar";
import GenericDialog from "../ui-components/dialog/GenericDialog";
import { showSnack } from "@/store/snack/snackSlice";
import { useDispatch } from "@/store/hooks";
import { set } from "lodash";
import { ptBR } from "date-fns/locale";

const RecordsTableList = () => {
  const theme = useTheme();
  const router = useRouter();
  const borderColor = theme.palette.divider;
  const [showDialog, setShowDialog] = React.useState(false);
  const [rows, setRows] = React.useState<ClientListObject>();
  const [backupRows, setBackupRows] = React.useState<ClientListObject>();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("calories");
  const [selected, setSelected] = React.useState<string>();
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    router.push("/editar?id=" + selected);
  };
  const [search, setSearch] = React.useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (value.length > 3) {
      const id = setTimeout(() => {
        getListClients();
      }, 1000);
      setTimeoutId(id);
    }
  };

  // This is for the sorting
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const validateRowsPerPage = () => {
    const totalClients = rows?.totalClients ?? 1;
    if (totalClients <= 5) {
      return [5];
    }
    if (totalClients <= 10) {
      return [5, 10];
    }
    if (totalClients <= 25) {
      return [5, 10, 25];
    }
  };

  async function getListClients() {
    const searchValue = search?.length > 3 ? search : "";
    setLoading(true);
    try {
      const res = await listClients(page + 1, rowsPerPage, searchValue);
      setRows(res);
      if (!searchValue) {
        setBackupRows(res);
      }
    } catch (err) {}
    setLoading(false);
  }

  async function handleDeleteClient() {
    setLoading(true);
    try {
      if (!selected) return;
      setShowDialog(false);

      await deleteClient(selected);
      getListClients();
      dispatch(
        showSnack({
          title: "Cliente deletado com sucesso!",
          type: "success",
        })
      );
    } catch (err) {}
    setLoading(false);
  }

  function isEmpty() {
    return rows?.clients?.length === 0;
  }

  React.useEffect(() => {
    if (search?.length <= 3) {
      setRows(backupRows);
    }
  }, [search]);

  React.useEffect(() => {
    getListClients();
  }, [page, rowsPerPage]);

  return (
    <DashboardCard title="Listagem de cadastros">
      <Box>
        {showDialog && (
          <GenericDialog
            cancelText="Voltar"
            confirmText="Deletar"
            title="Tem certeza que deseja continuar?"
            content="Ao continuar, você irá deletar o cadastro selecionado."
            handleCancel={() => setShowDialog(false)}
            handleConfirm={() => handleDeleteClient()}
          />
        )}

        <EnhancedTableToolbar
          numSelected={0}
          search={search}
          handleSearch={(event: any) => handleSearch(event.target.value)}
        />
        <Paper
          variant="outlined"
          sx={{ mx: 2, mt: 1, border: `1px solid ${borderColor}` }}
        >
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={0}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows?.clients?.length ?? 1}
              />
              <TableBody>
                {loading ? (
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width={"100%"}
                            height={30}
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width={"100%"}
                            height={30}
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width={"100%"}
                            height={30}
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width={"100%"}
                            height={30}
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            animation="wave"
                            variant="text"
                            width={"100%"}
                            height={30}
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  rows?.clients?.map((row: ClientList, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={index}>
                        <TableCell>
                          <Typography>{row.name}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>{row.email}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>{row.cellPhone}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {format(new Date(row.createdAt), "dd'/'MM'/'yyyy", {
                              locale: ptBR,
                            })}
                          </Typography>
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
                            <MenuItem onClick={() => handleEdit()}>
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
                  })
                )}
              </TableBody>
            </Table>
            {isEmpty() && (
              <Box sx={{ textAlign: "center", paddingTop: "40px" }}>
                {search
                  ? "Nenhum cadastro referente a pesquisa encontrado"
                  : "Vazio"}
              </Box>
            )}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={validateRowsPerPage()}
            component="div"
            count={rows?.totalClients ?? 1}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </DashboardCard>
  );
};

export default RecordsTableList;
