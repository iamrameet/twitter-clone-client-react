import Icon from "../Icon";
import "./ActionButton.css";

type stringLike = string | number | boolean;

type ButtonProperties = {
  text?: stringLike;
  children: JSX.Element;
  width?: "w-fill";
  accent?: "default" | "green" | "pink";
  size?: "medium" | "small" | "large";
  colored?: boolean;
  disabled?: boolean;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ActionButton(props: ButtonProperties){

  const { width, accent, size = "medium", title, colored, disabled = false, onClick, text, children } = props;

  return <button
    className={
      "container row center action "
      + (accent ? " " + accent : "")
      + (width ? " " + width : "")
      + (size === "large" ? "" : size === "small" ? " text-sm" : "")
      + (colored ? " colored" : "")
    }
    title={ title }
    disabled={ disabled }
    onClick={ onClick }
  >
    <Icon>{ children }</Icon>
    <div className="container text">{ text }</div>
  </button>;

};