/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@/components/ui/button';
import cn from 'classnames';
interface UploaderProps {
  label?: string;
  useUppercaseLabel?: boolean;
  setFile?: (file: any) => void;
  uploaded?: File | undefined;
}

const Uploader: React.FC<UploaderProps> = ({
  label,
  useUppercaseLabel = true,
  setFile = () => {},
  uploaded,
}) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    // @ts-ignore
    accept: 'image/*',
    multiple: false,
    onDrop: (acceptedFiles: any) => {
      setFile(acceptedFiles[0]);
      console.log('accept: ' + acceptedFiles[0]);
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    if (uploaded === undefined) return;
    setFile(uploaded);
    setFiles([uploaded as never]);
  }, [uploaded, setFile]);

  const thumbs = files.map((file: any) => (
    <div key={file.name} className="h-20 w-20 overflow-hidden rounded-full">
      <img
        src={file.preview}
        className="mx-auto max-h-full max-w-full object-contain"
        alt="uploaded image"
      />
    </div>
  ));

  return (
    <div className="flex w-full flex-col text-xs sm:text-sm">
      {label && (
        <span
          className={cn(
            'block text-xs font-medium tracking-widest text-gray-100 xl:text-sm 3xl:text-base',
            useUppercaseLabel ? 'mb-2 uppercase sm:mb-3' : 'mb-2'
          )}
        >
          {label}
        </span>
      )}
      <div
        className={`${
          files.length > 0 ? 'w-fit rounded-full p-2' : 'w-full rounded-lg'
        } cursor-pointer border-2 border-dashed border-dark bg-light-gray `}
      >
        <div
          {...getRootProps({
            className: 'h-full flex items-center justify-center rounded-lg',
          })}
        >
          <input {...getInputProps()} />
          {files.length > 0 ? (
            thumbs
          ) : (
            <div className="flex h-full w-full flex-col items-center gap-2 p-3 text-center text-2xs xl:text-xs">
              <div>
                drag and drop an image file or{' '}
                <div className="inline text-primary">browse files</div> to
                upload.
              </div>
              <div>
                only .png format is supported. must be &gt; 5 mb, transparent
                and circular
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Uploader;
