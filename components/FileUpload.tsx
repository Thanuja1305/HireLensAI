import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon, DocumentTextIcon, XIcon } from './icons/Icons';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, acceptedTypes }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file && acceptedTypes.split(',').some(type => file.name.endsWith(type) || file.type.split(',').some(accepted => accepted.includes(type)))) {
        setSelectedFile(file);
        onFileSelect(file);
    } else {
        // Optionally show an error for invalid file type
        setSelectedFile(null);
        onFileSelect(null);
    }
  }, [acceptedTypes, onFileSelect]);

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFile(e.target.files ? e.target.files[0] : null);
    if (e.target) {
        e.target.value = "";
    }
  };

  const onBrowseClick = () => {
    inputRef.current?.click();
  };
  
  const onRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (inputRef.current) {
        inputRef.current.value = "";
    }
  }

  return (
    <div onDragEnter={handleDrag} className="w-full">
      {!selectedFile ? (
        <div
          onClick={onBrowseClick}
          className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragActive ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <UploadCloudIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-cyan-600">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-gray-500">{acceptedTypes.replace(/,/g, ', ').toUpperCase()}</p>
          </div>
          <input
              ref={inputRef}
              type="file"
              id="single-file-upload"
              className="hidden"
              accept={acceptedTypes}
              onChange={handleChange}
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
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded-lg text-sm">
            <div className="flex items-center gap-3 overflow-hidden">
            <DocumentTextIcon className="w-6 h-6 text-cyan-600 flex-shrink-0" />
            <span className="font-medium text-slate-700 truncate">{selectedFile.name}</span>
            </div>
            <button onClick={onRemoveFile} className="p-1 text-gray-500 hover:text-red-600 rounded-full transition-colors">
            <XIcon className="w-5 h-5" />
            </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
