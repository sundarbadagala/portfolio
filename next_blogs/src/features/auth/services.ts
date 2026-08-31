import { api } from "@/shared/lib/apiHandler";
import {
  API_AUTH_REGISTER,
  API_AUTH_LOGIN,
  API_AUTH_LOGOUT,
  API_AUTH_ME,
} from "@/shared/lib/endpoints";
import type {
  UserProfile,
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "./types";

export async function getAuthSession(options?: { signal?: AbortSignal }): Promise<UserProfile | null> {
  const res = await api.get(API_AUTH_ME, { signal: options?.signal });
  const data = res.data as AuthResponse<UserProfile>;
  return (data && data.status === "success" && data.data) ? data.data : null;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse<UserProfile>> {
  const res = await api.post(API_AUTH_LOGIN, { payload });
  return res.data as AuthResponse<UserProfile>;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse<UserProfile>> {
  const res = await api.post(API_AUTH_REGISTER, { payload });
  return res.data as AuthResponse<UserProfile>;
}

export async function logoutUser(): Promise<AuthResponse<null>> {
  const res = await api.post(API_AUTH_LOGOUT);
  return res.data as AuthResponse<null>;
}
