import { del, get, post, put } from "./generic";

export interface WaveRunner {
  id?: string;
  cpf: string;
  brand: string;
  model: string;
  year: string;
  newOrUsed: string;
}

export interface WaveRunnerList {
  id: string;
  model: string;
  year: string;
  brand: string;
}

export interface WaveRunnerModel {
  id: string;
  waveRunners: string[];
}

export async function allWaveRunners(): Promise<WaveRunnerModel[]> {
  try {
    const res = await get("/waverunners/model-list");
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function addWaveRunner(data: WaveRunner) {
  try {
    const res = await post("/waverunners", data);
    return res.data;
  } catch (err: any) {
    throw err;
  }
}

export async function getListWaveRunners(
  id: string
): Promise<WaveRunnerList[]> {
  try {
    const res = await get(`/waverunners/list/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteWaveRunner(id: string) {
  try {
    const res = await del(`/waverunners/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function updateWaveRunner(data: WaveRunner) {
  try {
    const res = await put(`/waverunners`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
}
