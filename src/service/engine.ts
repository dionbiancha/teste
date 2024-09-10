import { ca } from "date-fns/locale";
import { del, get, post } from "./generic";

export interface Engine {
  id?: string;
  modelType: string;
  cpf?: string;
  model: string;
  power: string;
  year: string;
  serial?: string;
  invoice?: string;
  saleDate: string;
  typeOfFuel: string;
  leisureOrCommercial: string;
}

export interface EnginesList {
  id: string;
  model: string;
  year: string;
  power: string;
}

export interface EngineModel {
  id: string;
  type: string;
  items: string[];
}

export async function allEngines(): Promise<EngineModel[]> {
  try {
    const res = await get("/engines/model-list");
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function addEngine(data: Engine) {
  try {
    const res = await post("/engines", data);
    return res.data;
  } catch (err: any) {
    throw err;
  }
}

export async function getListEngines(id: string): Promise<EnginesList[]> {
  try {
    const res = await get(`/engines/list/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteEngine(id: string) {
  try {
    const res = await del(`/engines/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}
