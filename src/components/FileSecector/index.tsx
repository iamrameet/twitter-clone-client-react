import React, { createContext, useRef, useState, useContext } from "react";

interface FileSelectorContextProps {
  selectedFiles: File[];
  openFileSelector: () => void;
}

const FileSelectorContext = createContext<FileSelectorContextProps | undefined>(undefined);

function FileSelectorProvider({ children }: { children: JSX.Element }){
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      const files = Array.from(fileInputRef.current.files || []);
      setSelectedFiles(files);
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <FileSelectorContext.Provider value={{ selectedFiles, openFileSelector }}>
      {children}
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple style={{ display: "none" }} />
    </FileSelectorContext.Provider>
  );
};

const FileSelector: React.FC = () => {
  const { selectedFiles, openFileSelector } = useContext(FileSelectorContext) as FileSelectorContextProps;

  return (
    <div>
      <button onClick={openFileSelector}>Select File</button>
      {selectedFiles.length > 0 && (
        <div>
          <p>Selected Files:</p>
          <ul>
            {selectedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { FileSelectorProvider, FileSelector };