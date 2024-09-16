import { Engine } from "./engine";
import { del, get, post, put } from "./generic";

export interface Vessels {
  id?: string;
  cpf: string;
  model: string;
  shipyard?: string;
  year: string;
  newOrUsed: string;
  length?: string;
  buildingMaterial?: string;
  engines?: Engine[];
}

export interface VesselsList {
  model: string;
  year: string;
  newOrUsed: string;
  id: string;
  cpf: string;
  shipyard?: string;
  length?: string;
  buildingMaterial?: string;
  engines?: Engine[];
}

export async function addVessel(data: Vessels[]) {
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

export async function updateVessel(data: Vessels) {
  try {
    const res = await put(`/vessels`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
}
