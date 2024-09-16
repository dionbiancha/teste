import axios, { AxiosRequestConfig } from "axios";
import { doLogout, getAccessToken } from "./auth";

let abortController: AbortController;

export class RequestCanceledError extends Error {
  constructor() {
    super();
  }
}

export interface FetchOptions {
  useAuth?: boolean;
  useAbort?: boolean;
  useInterceptor?: boolean;
  config?: AxiosRequestConfig;
}

const DEFAULT_FETCH_OPTIONS: FetchOptions = {
  useAbort: false,
  useInterceptor: true,
  useAuth: true,
};

async function getInstance(options?: FetchOptions) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  console.log(baseURL, "aquiii");
  let headers = {};

  if (options?.useAuth) {
    const accessToken = getAccessToken();
    headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${accessToken}`,
      Accept: "/",
    };
  }

  if (options?.useAbort) abortController = new AbortController();

  const instance = axios.create({
    baseURL,
    headers,
    signal: options?.useAbort ? abortController.signal : undefined,
  });

  return instance;
}

export async function get(endpoint: string, options?: FetchOptions) {
  const _options = { ...DEFAULT_FETCH_OPTIONS, ...options };

  const axios = await getInstance(_options);

  try {
    const res = await axios.get(endpoint, _options.config);
    return res;
  } catch (error: any) {
    if (error instanceof RequestCanceledError) throw error;
    throw error.response;
  }
}

export async function post(
  endpoint: string,
  data: any,
  options?: FetchOptions
) {
  const _options = { ...DEFAULT_FETCH_OPTIONS, ...options };

  const axios = await getInstance(_options);

  try {
    const res = await axios.post(endpoint, data, _options.config);
    return res;
  } catch (error: any) {
    if (error instanceof RequestCanceledError) throw error;
    throw error.response;
  }
}

export async function put(endpoint: string, data: any, options?: FetchOptions) {
  const _options = { ...DEFAULT_FETCH_OPTIONS, ...options };

  const axios = await getInstance(_options);

  try {
    const res = await axios.put(endpoint, data, _options.config);
    return res;
  } catch (error: any) {
    if (error instanceof RequestCanceledError) throw error;
    throw error.response;
  }
}

export async function del(endpoint: string, options?: FetchOptions) {
  const _options = { ...DEFAULT_FETCH_OPTIONS, ...options };
  const axios = await getInstance(_options);

  try {
    const res = await axios.delete(endpoint, _options.config);
    return res;
  } catch (error: any) {
    if (error instanceof RequestCanceledError) throw error;
    throw error.response;
  }
}

export function abortRequest() {
  try {
    abortController.abort();
  } catch (error) {}
}
