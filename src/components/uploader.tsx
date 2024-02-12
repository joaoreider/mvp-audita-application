"use client";
import { FaUpload } from "react-icons/fa6";
import FileItem from "./file-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "./ui/use-toast";

export type Status = "ok" | "pending" | "error";
type FileUploaded = {
  name: string;
  size: number;
};

export default function Uploader() {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploaded[]>([]);
  const [fileProgress, setFileProgress] = useState<{ [key: string]: number }>(
    {}
  );
  const [fileStatus, setFileStatus] = useState<{ [key: string]: Status }>({});
  const [canUpload, setCanUpload] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxFileSize = 5;
  const MAX_FILE_BYTES = maxFileSize * 1024 * 1024; // 5MB to bytes

  useEffect(() => {
    setCanUpload(uploadedFiles.length < 5);
  }, [uploadedFiles]);

  const handleDelete = (name: string) => {
    setUploadedFiles(uploadedFiles.filter((item) => item.name !== name));
  };

  const fileAlreadyUploaded = (file: File) => {
    return uploadedFiles.some((f) => f.name === file.name);
  };

  const verifyIfCanUpload = (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      toast({
        variant: "destructive",
        description: `Tamanho máximo de arquivo permitido: ${maxFileSize} MB`,
      });
      return false;
    }
    if (fileAlreadyUploaded(file)) {
      toast({
        description: "Esse arquivo já foi carregado",
      });
      return false;
    }
    if (uploadedFiles.length >= 5) {
      console.log("Limite de arquivos atingido");
      return false;
    }
    return true;
  };

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      for (const file of files) {
        if (verifyIfCanUpload(file)) {
          setUploadedFiles((prev) => [
            ...prev,
            { name: file.name, size: file.size },
          ]);
          setFileProgress((prev) => ({ ...prev, [file.name]: 0 }));
          fileUploadHandler(file);
        }
      }
    }
  };

  const mockProgress = (progress: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(progress);
      }, 300);
    });
  };

  const mockFileUploadHandler = async (file: File) => {
    let progress = 0;
    while (progress < 100) {
      progress += 10;
      setFileProgress((prev) => ({ ...prev, [file.name]: progress }));
      await mockProgress(progress);
    }
    setFileStatus((prev) => ({ ...prev, [file.name]: "ok" }));
  };

  const fileUploadHandler = async (file: File) => {
    try {
      await mockFileUploadHandler(file);
    } catch (error) {
      setFileStatus((prev) => ({ ...prev, [file.name]: "error" }));
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
            <div className="flex flex-col items-center text-center justify-center pt-5 pb-6">
              <FaUpload size={42} color="white" className="mb-4" />
              {canUpload ? (
                <span className="leading-7  text-muted-foreground">
                  Faça o upload de até{" "}
                  {5 - uploadedFiles.length === 1
                    ? `1 arquivo `
                    : `${5 - uploadedFiles.length} arquivos `}
                  (5MB cada)
                </span>
              ) : (
                <span className="leading-7  text-muted-foreground text-yellow-400">
                  Limite de arquivos atingido
                </span>
              )}
            </div>

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
          {uploadedFiles.map((file) => (
            <div
              key={file.name}
              className="flex flex-col w-full p-0 m-0 items-center justify-center"
            >
              <FileItem
                name={file.name}
                size={file.size}
                progress={fileProgress[file.name]}
                status={fileStatus[file.name]}
                onDelete={() => handleDelete(file.name)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
