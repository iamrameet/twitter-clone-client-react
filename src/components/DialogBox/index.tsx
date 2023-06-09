import { ArrowLeft, X } from "@phosphor-icons/react";
import "./Style.css";
import IconButton from "../IconButton";
import React, { createContext, useContext, useState } from "react";
import { OverlayProperties } from "../Overlay";

type DialogBoxProperties = {
  children: JSX.Element | JSX.Element[];
  closeHandle: () => void;
  headerButtons?: JSX.Element[];
  closeIcon?: "cancel" | "back"
  title?: string;
  id?: string;
};

type OverlayComponent = React.FunctionComponentElement<OverlayProperties>;

export const OverlayContext = createContext<{
  openHandle: (dialog: OverlayComponent) => void;
  closeHandle: (index: number) => void;
}>({
  openHandle(){},
  closeHandle(){}
});

export function OverlayList(){

  const [ dialogs, setDialogs ] = useState<OverlayComponent[]>([]);

  function addDialog(dialog: OverlayComponent, index?: number){
    index ??= dialogs.length;
    dialogs.splice(index, 1, dialog);
    setDialogs([ ...dialogs ]);
    return index;
  }

  function removeDialog(index: number){
    console.log(index);
    dialogs.splice(index, 1);
    setDialogs([ ...dialogs ]);
  }

  return { dialogs, addDialog, removeDialog };

}

export default function DialogBox(props: DialogBoxProperties){

  return <dialog className="container absolute w-fill h-fill overlay center">
    <div className="container dialog">

      <header className="container w-fill row gap pad-500 between">
        <IconButton onClick={ () => props.closeHandle() }>
          { props.closeIcon === "back"? <ArrowLeft/> : <X/> }
        </IconButton>
        { props.title ? <h2>{ props.title }</h2> : "" }
        { props.headerButtons }
      </header>

      <div className="container h-fill center content" id={ props.id }>{ props.children }</div>

    </div>
  </dialog>;

};

export type { DialogBoxProperties };