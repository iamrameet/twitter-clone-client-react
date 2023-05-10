import "@phosphor-icons/react";
import "./Style.css";
import React from "react";

type IconButtonProperties = {
  children: JSX.Element;
  emphasis?: "low" | "medium" | "high";
  isMono?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function IconButton(props: IconButtonProperties){

  const { emphasis, isMono = false } = props;

  return <button className={
    "icon"
    + (emphasis ? " emphasis-" + emphasis : "")
    + (isMono ? " mono" : "")
  }
  type={ props.type }
  onClick={ props.onClick }>{ props.children }</button>;
};