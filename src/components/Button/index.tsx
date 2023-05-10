import React from "react";

type ButtonProperties = {
  children: string | JSX.Element[];
  emphasis?: "low" | "medium" | "high";
  isMono?: boolean;
  width?: "w-fill";
  size?: "medium" | "small" | "large";
  disabled?: boolean;
  spinner?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
};

export default function Button(props: ButtonProperties){

  const { emphasis = "low", isMono = false, width, size = "medium", disabled = false, spinner = false, onClick, children } = props;

  return <button
    className={
      "container row center gap-500 "
      + (spinner ? " has-spinner" : "")
      + (emphasis ? " emphasis-" + emphasis : "")
      + (isMono ? " mono" : "")
      + (width ? " " + width : "")
      + (size === "large" ? " pad" : size === "small" ? " text-sm pad-500" : "")
    }
    disabled={ disabled }
    onClick={ onClick }
  >
    { spinner ? <>
      <div className="container spinner small absolute"></div>
      <div className="text">{ children }</div>
    </> : children }
  </button>;

};