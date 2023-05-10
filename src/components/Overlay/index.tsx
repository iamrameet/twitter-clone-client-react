type OverlayProperties = {
  children: JSX.Element;
  closeHandle: () => void;
};

export default function Overlay(props: OverlayProperties){

  return <div
    className="container absolute w-fill h-fill center"
    onClickCapture={ ({ currentTarget, target }) => {
      if(target === currentTarget){
        props.closeHandle();
      }
    }}
  >
    { props.children }
  </div>;

};

export type { OverlayProperties };