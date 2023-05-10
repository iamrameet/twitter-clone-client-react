import { useContext, useState } from "react"
import DialogBox, { OverlayContext } from "../DialogBox"
import "./style.css";
import Overlay from "../Overlay";

type MenuItem = {
  text: string;
  onClick: () => void;
  emphasis?: "danger"
};

export default function Menu(props: { items?: { [id: string]: MenuItem }, top?: number; bottom?: number; left?: number; right?: number; }){

  const [ items, setItems ] = useState(props.items ?? {});
  const { closeHandle } = useContext(OverlayContext);

  const style = {
    left: props.left !== undefined ? props.left + "px" : "unset",
    top: props.top !== undefined ? props.top + "px" : "unset",
    right: props.right !== undefined ? props.right + "px" : "unset",
    bottom: props.bottom !== undefined ? props.bottom + "px" : "unset"
  };

  return <Overlay closeHandle={ () => closeHandle(0) }>
    <div className="container menu" style={ style }>
    {
      Object.entries(items).map(([id, item]) => {
        return <div
          key={ id }
          className={ "container w-fill h-fill menu-item todo" + (item.emphasis ? " " + item.emphasis : "") }
          onClick={ item.onClick }
        >{ item.text }</div>
      })
    }
    </div>
  </Overlay>
}