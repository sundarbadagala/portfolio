export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isUser?: boolean;
  role: string;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}

export interface AuthResponse<T = unknown> {
  status: string;
  message?: string;
  data?: T;
}
