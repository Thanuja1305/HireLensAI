import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon, DocumentTextIcon, XIcon } from './icons/Icons';

interface MultiFileUploadProps {
  onFilesSelect: (files: File[]) => void;
  acceptedTypes: string;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({ onFilesSelect, acceptedTypes }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateFiles = useCallback((newFiles: File[]) => {
      setSelectedFiles(newFiles);
      onFilesSelect(newFiles);
  }, [onFilesSelect]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (files) {
        const newFiles = Array.from(files).filter(file => 
            acceptedTypes.split(',').some(type => file.name.toLowerCase().endsWith(type.trim()))
        );
        const combined = [...selectedFiles, ...newFiles];
        // Remove duplicates by name
        const uniqueFiles = combined.filter((file, index, self) =>
            index === self.findIndex((f) => f.name === file.name)
        );
        updateFiles(uniqueFiles);
    }
  }, [acceptedTypes, selectedFiles, updateFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
    if (e.target) {
        e.target.value = "";
    }
  };

  const onBrowseClick = () => {
    inputRef.current?.click();
  };
  
  const onRemoveFile = (fileToRemove: File) => {
    const newFiles = selectedFiles.filter(file => file !== fileToRemove);
    updateFiles(newFiles);
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  }

  return (
    <div onDragEnter={handleDrag} className="w-full">
      <div
        onClick={onBrowseClick}
        className={`relative flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          dragActive ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <UploadCloudIcon className="w-8 h-8 mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-cyan-600">Click to upload</span> or drag & drop resumes
          </p>
          <p className="text-xs text-gray-500">{acceptedTypes.replace(/,/g, ', ').toUpperCase()}</p>
        </div>
        <input
            ref={inputRef}
            type="file"
            id="multi-file-upload"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleChange}
            multiple
        />
        {dragActive && (
          <div
            className="absolute inset-0 w-full h-full"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </div>

      {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Selected Resumes ({selectedFiles.length})</h4>
              {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 bg-gray-100 border border-gray-200 rounded-lg text-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                          <DocumentTextIcon className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{file.name}</span>
                      </div>
                      <button onClick={() => onRemoveFile(file)} className="p-1 text-gray-500 hover:text-red-600 rounded-full transition-colors">
                          <XIcon className="w-4 h-4" />
                      </button>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default MultiFileUpload;