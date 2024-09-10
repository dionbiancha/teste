interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

export const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Nome",
  },

  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "E-mail",
  },
  {
    id: "model",
    numeric: false,
    disablePadding: false,
    label: "Celular",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Criado em",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Ação",
  },
];
