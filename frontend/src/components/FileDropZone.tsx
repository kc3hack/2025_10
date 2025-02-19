'use client';
import React from 'react';
import { useDropzone } from 'react-dropzone';

export interface UploadedFile {
  file: File;
  filePath: string;
}

interface FileDropZoneProps {
  file: UploadedFile | null;
  setFile: (file: UploadedFile | null) => void;
}

const FileDropZone = ({ file, setFile }: FileDropZoneProps) => {
  const onDrop = (files: File[]): void => {
    if (files.length !== 1) {
      console.log('ファイルは1つだけアップロードしてください');
      return;
    }

    const file = files[0];

    const render = new FileReader();
    render.readAsDataURL(file);
    render.onload = () => {
      setFile({ file, filePath: render.result as string });
      console.log('upload');
    };
  };

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={
        isDragActive
          ? 'h-3/6 rounded-lg border-2 border-dotted border-red-400'
          : 'h-3/6 rounded-lg border-2 border-dotted border-gray-300'
      }
    >
      {!file && (
        <p
          className={
            isDragActive
              ? 'flex h-full items-center justify-center text-center text-gray-600'
              : 'flex h-full items-center justify-center text-center text-gray-400'
          }
        >
          ここにアップロードしたい画像をドラッグ&ドロップしてください。
        </p>
      )}
    </div>
  );
};

export default FileDropZone;
