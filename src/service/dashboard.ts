import { ca } from "date-fns/locale";
import { get } from "./generic";

export interface DashboardOverview {
  engines: number;
  clients: number;
  vessels: number;
  waverunners: number;
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  try {
    const res = await get("/overview");
    return res.data;
  } catch (err) {
    throw err;
  }
}
