'use client';
import React, { useRef, forwardRef } from 'react';
import { CiImageOn } from 'react-icons/ci';

interface FileUploadButtonProps {
  onChangeFileCallback: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

interface HiddenInputProps {
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>(
  ({ onFileInputChange }, inputRef) => {
    return (
      <input hidden ref={inputRef} type='file' accept='image/*' onChange={onFileInputChange} />
    );
  }
);

HiddenInput.displayName = 'HiddenInput';

/**
 * 画像をアップロードするボタン
 */
const FileUploadButton = ({ onChangeFileCallback, className }: FileUploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileUpload = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <HiddenInput onFileInputChange={onChangeFileCallback} ref={inputRef} />
      <CiImageOn
        className={`size-8 cursor-pointer hover:opacity-70 ${className}`}
        onClick={fileUpload}
      />
    </div>
  );
};

export default FileUploadButton;
