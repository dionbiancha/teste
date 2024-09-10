import { AxiosError, AxiosRequestConfig } from "axios";
import { get, post } from "./generic";
import { useRouter } from "next/navigation";

export class IncorrectCredentialsError extends Error {
  constructor() {
    super();
  }
}

export interface LoginInterface {
  user: string;
  password: string;
}

/**
 *
 * @param user
 * @param password
 */
export async function doLogin({ user, password }: LoginInterface) {
  doLogout();

  try {
    const res = await post("auth/sign-in", {
      user,
      password,
    });

    const accessToken = res.data.token;

    sessionStorage.setItem("accessToken", accessToken);

    return res.data;
  } catch (err: any) {
    if (String(err.data?.message).includes("incorretos")) {
      throw new IncorrectCredentialsError();
    } else if (String(err.data?.message).includes("Incorrect")) {
      throw new IncorrectCredentialsError();
    } else if (String(err.data?.message).includes("not found")) {
      throw new IncorrectCredentialsError();
    } else {
      throw err;
    }
  }
}

export function getAccessToken() {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) return accessToken;
}

export const doLogout = () => {
  sessionStorage.removeItem("accessToken");
};
