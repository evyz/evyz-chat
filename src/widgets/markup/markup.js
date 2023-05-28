import React, { useEffect, useRef } from "react";
import "./markup.css";

const Row = ({
  widgetId,
  children,
  style,
  className,
  onClick,
  isFlex,
  flexParams,
}) => {
  function clickHandler(e) {
    onClick && onClick(e);
  }

  const flexStyles = isFlex && { ...flexParams };

  return (
    <div
      onClick={clickHandler}
      className={`system_row ${className ? className : ""} `}
      style={{ ...style, ...flexStyles }}
    >
      {children}
    </div>
  );
};

const Cell = ({ widgetId, children, size, style, className, onClick }) => {
  if (size > 12) {
    throw new Error("COLUMN_SIZE more than 12");
  }
  size = "system_col-" + (size ? size : 3);

  const divRef = useRef();

  return (
    <div
      ref={divRef}
      onClick={(e) => onClick && onClick(e)}
      style={{ ...style }}
      className={`system_cell ${size} ${className ? className : ""}`}
    >
      {children}
    </div>
  );
};

export { Row, Cell };
