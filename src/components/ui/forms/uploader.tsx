/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@/components/ui/button';
import cn from 'classnames';
interface UploaderProps {
  label?: string;
  useUppercaseLabel?: boolean;
  setFile?: (file: any) => void;
}

const Uploader: React.FC<UploaderProps> = ({
  label,
  useUppercaseLabel = true,
  setFile = () => {},
}) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    // @ts-ignore
    accept: 'image/*',
    multiple: false,
    onDrop: (acceptedFiles: any) => {
      setFile(acceptedFiles[0]);
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file: any) => (
    <div key={file.name} className="h-full w-full">
      <img
        src={file.preview}
        className="mx-auto max-h-full max-w-full object-contain"
        alt="uploaded image"
      />
    </div>
  ));

  return (
    <div className="flex w-3/4 flex-col text-xs sm:text-sm">
      {label && (
        <span
          className={cn(
            'block font-medium tracking-widest text-gray-100',
            useUppercaseLabel ? 'mb-2 uppercase sm:mb-3' : 'mb-2'
          )}
        >
          {label}
        </span>
      )}
      <div className="h-12 w-full rounded-lg border border-solid border-gray-700 bg-light-dark">
        <div
          {...getRootProps({
            className: 'h-full flex items-center justify-center rounded-lg',
          })}
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            thumbs
          ) : (
            <div className="flex h-full w-full items-center justify-between text-center">
              <p className="pl-4 text-sm tracking-tighter text-gray-400">
                PNG,JPG,SVG. Max 10MB.
              </p>
              <Button size="small" className="!h-full" shape="rounded">
                Upload
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Uploader;
