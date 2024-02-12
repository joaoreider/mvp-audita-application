"use client";
import { FaUpload } from "react-icons/fa6";
import FileItem from "./file-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "./ui/use-toast";

export default function Uploader() {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileStatus, setFileStatus] = useState<{ [key: string]: string }>({});
  const [fileProgress, setFileProgress] = useState<{ [key: string]: number }>(
    {}
  );
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [canUpload, setCanUpload] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxFileSize = 5;
  const MAX_FILE_BYTES = maxFileSize * 1024 * 1024; // 5MB to bytes

  // const handleDelete = (id: number) => {
  //   setUploadedFiles(uploadedFiles.filter((item) => item.id !== id));
  // };

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null); // reset the upload error when a new file is selected
    if (event.target.files) {
      const files = Array.from(event.target.files);
      let isValid = true; // Flag to check if all files are valid
      let fileErrors: { [key: string]: string } = {};
      if (files.length + uploadedFiles.length >= 5) {
        setCanUpload(false);
        isValid = false;
      }
      for (const file of files) {
        if (file.size > MAX_FILE_BYTES) {
          fileErrors[
            file.name
          ] = `Tamanho máximo de arquivo permitido: ${maxFileSize} MB`;
          isValid = false;
          toast({
            variant: "destructive",
            description: `Tamanho máximo de arquivo permitido: ${maxFileSize} MB`,
          });
        }
      }
      if (!isValid) {
        console.log("Erro nos arquivos: ", fileErrors);
        setFileStatus(fileErrors);
      } else {
        files.forEach((file) => {
          setFileProgress((prev) => ({ ...prev, [file.name]: 0 }));
          setUploadedFiles((prevFiles) => [
            ...prevFiles,
            ...(event.target.files ? Array.from(event.target.files) : []),
          ]);
          //TODO: Enviar o arquivo para o servidor
          // fileUploadHandler(file);
        });
      }
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <form
          action="#"
          className="relative flex flex-col items-center justify-center  p-2 w-full"
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaUpload size={42} color="white" className="mb-4" />
              {canUpload ? (
                <span className="leading-7  text-muted-foreground">
                  Clique para carregar (5 arquivos no máximo, 5MB cada)
                </span>
              ) : (
                <span className="leading-7  text-muted-foreground text-red-400">
                  Limite de arquivos atingido
                </span>
              )}
            </div>
            {/* {only upload if uploadedFiles.lenght < 5 } */}

            <input
              id="dropzone-file"
              type="file"
              onChange={fileSelectedHandler}
              multiple={true}
              className="hidden"
              ref={fileInputRef}
              disabled={!canUpload}
            />
          </label>
        </form>
      </div>

      <ScrollArea className="w-full px-10">
        <div className="flex flex-col overflow-y-auto max-h-[400px] p-2 w-full items-center justify-center">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex flex-col w-full p-0 m-0 items-center justify-center"
            >
              <FileItem
                name={file.name}
                status={true}
                size={file.size}
                // onDelete={() => handleDelete(file.id)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
{
  /* <FileItem
file={file}
status={fileStatus[file.name]}
progress={fileProgress[file.name]}
/> */
}
