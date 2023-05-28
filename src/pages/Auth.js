import React, { useState } from "react";
import Wrapper from "../widgets/wrapper/wrapper";
import { Cell, Row } from "../widgets/markup/markup";
import Input from "../widgets/inputs/input";
import Button from "../widgets/buttons/button";

const Auth = ({ setPage }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [nikcname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const [nicknameError, setNicknameError] = useState({
    status: false,
    message: "ok",
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    message: "ok",
  });

  const authHandler = () => {
    setIsLoading(true);

    localStorage.setItem("token", JSON.stringify({ name: nikcname }));
    setPage("/");

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <Wrapper>
      <Row className={"a-center j-center h-100vh"}>
        <Cell className={"auth_component_height"} size={10}>
          <Row className={"h-100"}>
            <Cell
              size={5}
              className={"h-100"}
              style={{ background: "var(--main-second-accent-color)" }}
            ></Cell>
            <Cell size={5} className={"d-flex f-col a-center j-center h-100"}>
              <h1>{isLogin ? "Авторизация" : "Регистрация"}</h1>

              <Input
                error={nicknameError}
                setError={setNicknameError}
                value={nikcname}
                setValue={setNickname}
                label={"Nickname"}
                rules={{ notNull: true }}
              ></Input>
              <Input
                error={passwordError}
                setError={setPasswordError}
                value={password}
                setValue={setPassword}
                label={"Password"}
                rules={{ notNull: true }}
              ></Input>

              <Button
                deps={[nikcname, password]}
                rulesToDeps={{ notNull: true }}
                isLoading={isLoading}
                onClick={() => authHandler()}
              >
                {isLogin ? "Войти" : "Зарегистрироваться"}
              </Button>
            </Cell>
          </Row>
        </Cell>
      </Row>
    </Wrapper>
  );
};

export default Auth;
