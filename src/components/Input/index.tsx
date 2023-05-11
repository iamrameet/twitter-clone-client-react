import React, { ReactNode, forwardRef, useEffect, useState } from "react";

export type InputProperties = React.InputHTMLAttributes<HTMLInputElement> & { name: string; };

export default function Input(props: InputProperties){
  return <div className="container w-fill pad">
    <div className="container input">
      <input { ...props }/>
      <label htmlFor={ props.id }>{ props.placeholder }</label>
    </div>
  </div>;
};

export type FileInputProperties = {
  multiple?: boolean;
  accept?: InputProperties["accept"];
  onSelect: (files: FileList) => void
};

export const FileInput = forwardRef(function(props: FileInputProperties, ref: React.LegacyRef<HTMLInputElement>){
  return <input
    type="file"
    ref={ ref }
    multiple={ props.multiple ?? false }
    accept={ props.accept }
    hidden={ true }
    onInput={
      ({ currentTarget }) => {
        if(currentTarget.files && currentTarget.files.length > 0)
          props.onSelect(currentTarget.files);
      }
    }
  />
});

export function InputGroup({ inputs }: { inputs: InputProperties[] }){

  const states: ReturnType<typeof useState<InputProperties["value"]>>[] = [];
  const elements: ReturnType<typeof Input>[] = [];

  for(const [ index, input ] of Object.entries(inputs)){
    const state = useState<InputProperties["value"]>(input.value);

    useEffect(function(){
      states.push(state);
      elements.push(
        <Input
          key={ index }
          {...input}
          name={ input.name }
          value={ state[0] }
          onInput={ ({ currentTarget }) => void state[1](currentTarget.value) }
        />
      );
    });
  }

  return { states, elements };

};

// function useStates<T extends { [id: string]: any | undefined }>(defaults: T){

//   const states: { [id in keyof T]: ReturnType<typeof useState<T>> } = {};
//   for(const id in defaults){
//     states[id] = useState<T[string]>(defaults[id]);
//   }

// }