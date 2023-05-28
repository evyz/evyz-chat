import React from "react";
import { Cell, Row } from "../../widgets/markup/markup";
import "./notifcation.css";

const NotificationComponent = ({ type, message, timeOutMs }) => {
  return (
    <Row className={"notifcation_block j-center a-center"}>
      <Cell size={7}>{message}</Cell>
    </Row>
  );
};

export default NotificationComponent;
