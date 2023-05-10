import { createContext, useState } from "react";

type PaginatorProperties = {
  limit: number;
  skip?: number;
  children: JSX.Element;
};

type PageContextProperties = {
  limit?: number;
  skip?: number;
  resolved: boolean;
  setResolver: (resolver: (limit: number, skip: number) => Promise<boolean>) => void
};

const PaginatorContext = createContext<PageContextProperties>({
  resolved: true,
  setResolver(){}
});

export { PaginatorContext };

export default function Paginator(props: PaginatorProperties){

  const [ skip, setSkip ] = useState(props.skip ?? 0);
  const [ limit, setLimit ] = useState(props.limit);
  const [ resolver, setResolver ] = useState<(limit: number, skip: number) => Promise<boolean>>();
  const [ resolved, resolve ] = useState(true);

  async function handleScroll(event: React.UIEvent<HTMLDivElement, UIEvent>){
    if(!resolved){
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const scrollRemain = scrollHeight - scrollTop - clientHeight;
    if(scrollRemain < 50){
      resolve(false);
      try{
        const isResolved = await resolver?.(limit, skip) ?? false;
        if(isResolved){
          setSkip(limit);
        }
        resolve(isResolved);
      } catch(ex){
        resolve(true);
      }
    }
  }

  return <PaginatorContext.Provider value={{ skip, limit, resolved, setResolver }} >
    <props.children.type
      className="container w-fill h-fill auto"
      onScroll={ handleScroll }
      { ...props.children.props }
    ></props.children.type>
  </PaginatorContext.Provider>;

}