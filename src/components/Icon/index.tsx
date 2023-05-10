import "./Icon.css";

export default function Icon(props: { children: JSX.Element, padding?: "less" }){
  return <div className={"icon" + (props.padding ? " pad-" + props.padding : "")}>{ props.children }</div>;
};