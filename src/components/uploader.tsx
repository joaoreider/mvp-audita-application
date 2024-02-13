"use client";
import { FaUpload } from "react-icons/fa6";
import FileItem from "./file-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "./ui/use-toast";
import { set } from "zod";

export type Status = "ok" | "pending" | "error";
type FileUploaded = {
  name: string;
  size: number;
  progress: number;
  status: Status;
};

type UploaderProps = {
  url: string;
};

export default function Uploader({ url }: UploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploaded[]>([]);
  const [canUpload, setCanUpload] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxFileSize = 5;
  const MAX_FILE_BYTES = maxFileSize * 1024 * 1024; // 5MB to bytes

  useEffect(() => {
    setCanUpload(uploadedFiles.length < 5);
    console.log("Uploaded files: ", uploadedFiles);
  }, [uploadedFiles]);

  const handleDelete = (name: string) => {
    setUploadedFiles(uploadedFiles.filter((item) => item.name !== name));
  };

  const handleUpdateFile = (
    file: File,
    status: Status = "pending",
    progress: number
  ) => {
    handleDelete(file.name);
    setUploadedFiles((prev) => [
      ...prev,
      {
        name: file.name,
        size: file.size,
        progress: progress,
        status: status,
      },
    ]);
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
      return false;
    }
    return true;
  };

  const fileSelectedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      for (const file of files) {
        if (verifyIfCanUpload(file)) {
          handleUpdateFile(file, "pending", 0);
          fileUploadHandler(file);
        }
      }
    }
  };

  const fileUploadHandler = (file: File) => {
    // clear upload reference
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    try {
      // Setup the form data to send
      const formData = new FormData();
      formData.append("files", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);

      // Upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          progress < 100
            ? handleUpdateFile(file, "pending", progress)
            : handleUpdateFile(file, "ok", progress);
        }
      });

      // File uploaded
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 201) {
            handleUpdateFile(file, "ok", 100);
          } else {
            console.error("Error uploading file: ", xhr.responseText);
            handleUpdateFile(file, "error", 0);
          }
        }
      });
      xhr.send(formData);
    } catch (error) {
      handleUpdateFile(file, "error", 0);
      console.error("Error uploading file: ", error);
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
              multiple={false}
              className="hidden"
              ref={fileInputRef}
              disabled={!canUpload}
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </label>
        </form>
      </div>

      <ScrollArea className="w-full px-10">
        <div className="flex flex-col overflow-y-auto max-h-[400px] p-2 w-full items-center justify-center">
          {uploadedFiles.map((file, index) => {
            return (
              <div
                key={index}
                className="flex flex-col w-full p-0 m-0 items-center justify-center"
              >
                <FileItem
                  name={file.name}
                  size={file.size}
                  progress={file.progress}
                  status={file.status}
                  onDelete={() => handleDelete(file.name)}
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
