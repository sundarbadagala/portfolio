type InputFieldType = "text" | "password" | "textarea";

export interface IStateQuery {
  sender: string;
  email: string;
  message: string;
}

export interface IStateError {
  sender: string;
  email: string;
  message: string;
}

export interface IQueryField {
  type: InputFieldType;
  label: string;
  id: string;
  placeholder: string;
}
