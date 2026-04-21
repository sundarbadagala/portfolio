export interface IUser {
  email: string;
  password: string;
}

export interface ILoginField {
  type: 'text' | 'password',
  label: string,
  id: string,
  placeholder: string,
}

export interface IPayload {
  email: string,
  password: string,
  callback: any
}