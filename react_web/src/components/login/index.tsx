import { useState, ChangeEvent } from "react";
import { ILoginField, IUser } from "./interface";
import { useNavigate } from "react-router-dom";
import { Button } from "@/share/atoms/button";
import { Text } from "@chakra-ui/react";
import InputField from "@/share/molecule/InputField";
import { NAVIGATE } from "@/helper/routes";
import { LOGIN_FIELDS } from "@/helper/constants";
import Wrapper from "@/share/organisms/Wrapper";
import { loginRequest } from "./slice.login";
import { useAppDispatch } from "@/hooks";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<IUser>({ email: "", password: "" });
  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    dispatch(
      loginRequest({
        email: user.email,
        password: user.password,
        callback: () => {
          navigate(NAVIGATE.login.dashboard);
        }
      })
    );
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };
  return (
    <Wrapper>
      <Text variant={"header"}>login page</Text>
      <form onSubmit={handleSubmit}>
        {LOGIN_FIELDS.map((item: ILoginField) => (
          <InputField
            key={item.id}
            type={item.type}
            label={item.label}
            id={item.id}
            placeholder={item.placeholder}
            value={user[item.id as keyof IUser]}
            onChange={handleChange}
          />
        ))}
        <Button onClick={handleSubmit} margin={"24px 0"}>
          Submit
        </Button>
      </form>
    </Wrapper>
  );
}

export default Login;
