import { del, get, post } from "./generic";

export interface Vessels {
  id?: string;
  cpf: string;
  model: string;
  shipyard?: string;
  year: string;
  newOrUsed: string;
  length?: string;
  buildingMaterial?: string;
}

export interface VesselsList {
  model: string;
  year: string;
  newOrUsed: string;
  id: string;
}

export async function addVessel(data: Vessels) {
  try {
    const res = await post("/vessels", data);
    return res.data;
  } catch (err: any) {
    throw err;
  }
}

export async function getListVessels(id: string): Promise<VesselsList[]> {
  try {
    const res = await get(`/vessels/list/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteVessel(id: string) {
  try {
    const res = await del(`/vessels/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}
