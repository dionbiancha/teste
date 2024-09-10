import { Client } from "@/service/client";
import { Engine } from "@/service/engine";
import { WaveRunner } from "@/service/waverunner";
import { Vessels } from "@/service/vessels";

export const GENDER = ["Masculino", "Feminino"];
export const MARITAL_STATUS = ["Solteiro", "Casado", "Divorciado", "Viúvo"];
export const PUBLIC_PLACE = [
  "Rua",
  "Avenida",
  "Praça",
  "Alameda",
  "Travessa",
  "Estrada",
  "Rodovia",
  "Viela",
  "Passagem",
  "Boulevard",
  "Outro",
];

export const STATES = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

export const BUILDING_MATERIAL = [
  "Fibra de vidro",
  "Alumínio",
  "Madeira",
  "Outros",
];

export const NEW_OR_USED = ["Novo", "Usado"];

export const LENGTH = [
  "15ft",
  "16ft",
  "17ft",
  "18ft",
  "19ft",
  "20ft",
  "21ft",
  "22ft",
  "23ft",
  "24ft",
  "25ft",
  "26ft",
  "27ft",
  "28ft",
  "29ft",
  "30ft",
  "31ft",
  "32ft",
  "33ft",
  "34ft",
  "35ft",
  "36ft",
  "37ft",
  "38ft",
  "39ft",
  "40ft",
  "41ft",
  "42ft",
  "43ft",
  "44ft",
  "45ft",
  "46ft",
  "47ft",
  "48ft",
  "49ft",
  "50ft",
  "51ft",
  "52ft",
  "53ft",
  "54ft",
  "55ft",
];

export const YEAR = [
  "1970",
  "1971",
  "1972",
  "1973",
  "1974",
  "1975",
  "1976",
  "1977",
  "1978",
  "1979",
  "1980",
  "1981",
  "1982",
  "1983",
  "1984",
  "1985",
  "1986",
  "1987",
  "1988",
  "1989",
  "1990",
  "1991",
  "1992",
  "1993",
  "1994",
  "1995",
  "1996",
  "1997",
  "1998",
  "1999",
  "2000",
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
];

export const TYPES = ["Jet Ski", "Embarcação"];

export const FUEL = [
  "Gasolina",
  "Álcool",
  "Flex",
  "Diesel",
  "Híbrido",
  "Elétrico",
];
export const LEISURE_OR_COMMERCIAL = ["Lazer", "Comercial"];

export const BRAND_WAVERUNNER = ["Yamaha", "Outros"];

export const DEFAULT_FORM_WAVERUNNER: WaveRunner = {
  cpf: "",
  brand: "",
  model: "",
  year: "",
  newOrUsed: "",
};

export const DEFAULT_FORM_TYPE = {
  type: "",
};

export const DEFAULT_FORM_VESSEL: Vessels = {
  cpf: "",
  model: "",
  shipyard: "",
  year: "",
  newOrUsed: "",
  length: "",
  buildingMaterial: "",
};
export const DEFAULT_FORM_ENGINE: Engine = {
  cpf: "",
  modelType: "",
  model: "",
  power: "",
  year: "",
  serial: "",
  invoice: "",
  saleDate: "",
  typeOfFuel: "",
  leisureOrCommercial: "",
};

export const DEFAULT_FORM_VALUES: Client = {
  gender: "",
  cpf: "",
  name: "",
  birthdate: null,
  maritalStatus: "",
  email: "",
  cellPhone: "",
  publicPlace: "",
  fixedPhone: "",
  comercialPhone: "",
  zipCode: "",
  city: "",
  state: "",
  number: "",
  complement: "",
  neighborhood: "",
  address: "",
};

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

export const headCells: readonly HeadCell[] = [
  {
    id: "model",
    numeric: false,
    disablePadding: false,
    label: "Modelo",
  },

  {
    id: "year",
    numeric: false,
    disablePadding: false,
    label: "Ano",
  },
  {
    id: "newOrUsed",
    numeric: false,
    disablePadding: false,
    label: "Novo ou usado",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Ação",
  },
];

export const headMotorsCells: readonly HeadCell[] = [
  {
    id: "model",
    numeric: false,
    disablePadding: false,
    label: "Marca/Modelo",
  },

  {
    id: "year",
    numeric: false,
    disablePadding: false,
    label: "Ano",
  },
  {
    id: "power",
    numeric: false,
    disablePadding: false,
    label: "Potência",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Ação",
  },
];

export const headWaveRunnerCells: readonly HeadCell[] = [
  {
    id: "model",
    numeric: false,
    disablePadding: false,
    label: "Modelo",
  },
  {
    id: "brand",
    numeric: false,
    disablePadding: false,
    label: "Marca",
  },
  {
    id: "year",
    numeric: false,
    disablePadding: false,
    label: "Ano",
  },

  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Ação",
  },
];
