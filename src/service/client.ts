import { del, get, post, put } from "./generic";

export interface Client {
  id?: string;
  email: string;
  name: string;
  birthdate: Date | null;
  cpf: string;
  gender: string;
  fixedPhone?: string;
  comercialPhone?: string;
  cellPhone: string;
  address?: string;
  city?: string;
  state?: string;
  number?: string;
  zipCode?: string;
  complement?: string;
  neighborhood?: string;
  maritalStatus: string;
  publicPlace: string;
}

export interface ClientList {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  cellPhone: string;
}

export interface ClientListObject {
  clients: ClientList[];
  totalPages: number;
  totalClients: number;
}

export interface Product {
  createdAt: string;
  id: string;
  model: string;
  type: string;
  year: string;
  brand?: string;
  newOrUsed?: string;
  invoice?: string;
  leisureOrCommercial?: string;
  modelType?: string;
  power?: string;
  saleDate?: string;
  serial?: string;
  typeOfFuel?: string;
  buildingMaterial?: string;
  length?: string;
  shipyard?: string;
}

export class CpfAlreadyRegistered extends Error {
  constructor() {
    super();
  }
}

export class EmailAlreadyRegistered extends Error {
  constructor() {
    super();
  }
}

export async function listClients(
  page: number,
  itemsPerPage: number,
  search?: string
): Promise<ClientListObject> {
  try {
    const res = await get(
      `/clients?itemsPerPage=${itemsPerPage}&page=${page}&search=${search}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function newClient(data: Client) {
  try {
    const res = await post("/clients", data);
    return res.data;
  } catch (err: any) {
    if (String(err.data?.message).includes("CPF already registered")) {
      throw new CpfAlreadyRegistered();
    }
    if (String(err.data?.message).includes("Email already registered")) {
      throw new EmailAlreadyRegistered();
    }
    throw err;
  }
}

export async function getClient(id: string): Promise<Client> {
  try {
    const res = await get(`/clients/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteClient(id: string) {
  try {
    const res = await del(`/clients/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function updateClient(data: Client) {
  try {
    const res = await put(`/clients`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function listProductsClient(cpf: string): Promise<Product[]> {
  try {
    const res = await get(`/clients/products/${cpf}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}
