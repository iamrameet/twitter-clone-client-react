import { useState } from "react";

export default function Tabs<T extends { [id: string]: { title: string, section: JSX.Element } }>(tabs: T, options?: { default: keyof T }){

  const key = options?.default ?? Object.keys(tabs)[0];
  const [ selected, select ] = useState<keyof T>(key);

  return {

    nav: <>
      {
        Object.keys(tabs).map(id => <a
          href="#"
          className={"container w-fill" + (id === selected ? " active" : "")}
          onClick={ () => select(id) }
        >{ tabs[id].title }</a>)
      }
    </>,

    section: <>
      { tabs[selected].section }
    </>,

    selected,
    select

  };

};