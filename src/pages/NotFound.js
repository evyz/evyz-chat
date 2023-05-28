import React from "react";
import Wrapper from "../widgets/wrapper/wrapper";
import { Cell } from "../widgets/markup/markup";

const NotFound = ({ oage, setPage }) => {
  return (
    <Wrapper>
      <Cell size={"100%"}>
        <h1>Page is not found</h1>
        <span
          onClick={() => setPage("/")}
          style={{ textDecoration: "underline" }}
        >
          back
        </span>
      </Cell>
    </Wrapper>
  );
};

export default NotFound;
