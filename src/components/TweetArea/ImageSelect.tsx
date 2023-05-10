import { createContext, useContext, useState } from "react";

type ImageSelectContextProperties = {
  images: string[],
  addImages: (...sources: string[]) => void,
  removeImage: (index: number) => void,
  onRemove?: (index: number) => void,
  clear: () => void
};

const ImageSelectContext = createContext<ImageSelectContextProperties>({
  images: [],
  addImages(){
    throw "ImageSelect context provider not found";
  },
  removeImage(){
    throw "ImageSelect context provider not found";
  },
  clear(){}
});

export { ImageSelectContext };

function filterSrc(src?: string){
  return src !== undefined;
}

export default function ImageSelect(){

  const { images, removeImage } = useContext(ImageSelectContext);
  const groups = [ [ images[0], images[3] ].filter(filterSrc), [ images[1], images[2] ].filter(filterSrc) ];

  return images.length === 0
  ? <></>
  : <div className="container w-fill row gap preview-images">
    {
      groups.map(group => (
        group.length === 0 ?
          <></>
        : <div className="container w-fill h-fill gap group">
          {
            group.map((src, index) => (
              <div
                className="container w-fill h-fill preview-image"
                style={{ backgroundImage: `url("${ src }")` }}
                onClick={ () => removeImage(index) }
              ></div>
            ))
          }
        </div>
      ))
    }
    </div>;

}

export function ImageSelectProvider({ sources = [], onRemove, children }: {
  sources?: string[],
  onRemove?: (index: number) => void,
  children: JSX.Element
}){

  const [ images, setImages ] = useState<ImageSelectContextProperties["images"]>(sources);

  function addImage(...sources: string[]){
    setImages(images.concat(sources));
  }

  function removeImage(index: number){
    images.splice(index, 1);
    onRemove?.(index);
    setImages([ ...images ]);
  }

  function clear(){
    for(let index = 0; index < images.length; index++){
      onRemove?.(index);
    }
    setImages([]);
  }

  return <ImageSelectContext.Provider value={{ images, addImages: addImage, removeImage, clear, onRemove }}>
    { children }
  </ImageSelectContext.Provider>;
};