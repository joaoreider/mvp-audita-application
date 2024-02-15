"use client";
import Navbar from "@/components/navbar";
import Report from "@/components/report";

import { ClimbingBoxLoader } from "react-spinners";

import SubmitButton from "@/components/submit-button";
import { v4 as uuidv4 } from "uuid";

import { FaUpload, FaArrowLeftLong } from "react-icons/fa6";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import axios from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import FileItem from "@/components/file-item";
import { useRouter } from "next/router";

const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Os meses começam do 0 em JavaScript
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year}T${hours}:${min}`;
};

export type Status = "ok" | "pending" | "error";
type FileUploaded = {
  name: string;
  size: number;
  progress: number;
  status: Status;
};

export type ReportData = {
  columns: string[];
  data: string[][];
  index: string[];
};

export default function Home() {
  const UPLOAD_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/files/upload";
  // código da análise: data-hora-uuid  (ex: 01/01/2022-12:00|1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed)
  const [analysisCode, setAnalysisCode] = useState<string>(
    formatDate(new Date()) + "|" + uuidv4()
  );
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploaded[]>([]);
  const [canUpload, setCanUpload] = useState<boolean>(true);

  const [reportData, setReportData] = useState<ReportData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxFileSize = 5;
  const MAX_FILE_BYTES = maxFileSize * 1024 * 1024; // 5MB to bytes

  const handleStartAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        variant: "destructive",
        description: "Nenhum arquivo carregado para análise.",
      });
      return;
    }
    if (uploadedFiles.some((file) => file.status !== "ok")) {
      toast({
        variant: "destructive",
        description: "Aguarde o carregamento dos arquivos.",
      });
      return;
    }
    setLoading(true);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/files/process?analysis-code=${analysisCode}`
    );
    if (response.status !== 200) {
      toast({
        variant: "destructive",
        description: "Erro ao processar arquivos. Tente novamente",
      });
      setLoading(false);
      return;
    }
    handleResetAnalysis();
    setLoading(false);

    const data = response.data;
    setReportData(data);
  };

  const handleResetAnalysis = () => {
    setAnalysisCode(formatDate(new Date()) + "|" + uuidv4());
    setUploadedFiles([]);
    setReportData(null);
  };

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
      xhr.open("POST", UPLOAD_URL, true);
      xhr.setRequestHeader("analysis-code", analysisCode);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen text-center">
        <ClimbingBoxLoader color="#3B82F6" speedMultiplier={2} />
      </div>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center m-0">
        <Navbar />
        {reportData ? (
          <div className="w-full py-2 px-6">
            <Button
              variant="default"
              className="my-1 mx-8"
              onClick={handleResetAnalysis}
            >
              <FaArrowLeftLong className="mr-2 h-4 w-4" /> Analisar mais
              arquivos
            </Button>
          </div>
        ) : null}
        <div className="w-full sm:w-1/2 md:w-1/3 flex flex-col items-center justify-center rounded-md border m-12 p-2  shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">
          {reportData ? (
            <div>
              <Report data={reportData} />
            </div>
          ) : (
            <div className="container">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="my-1">
                    Nova análise
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação é definitiva e exclui todos os arquivos
                      carregados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetAnalysis}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
          )}
        </div>
        <div className="flex flex-col">
          {!reportData ? (
            <SubmitButton
              onClick={handleStartAnalysis}
              className="shadow-xl text-white font-semibold rounded-md px-4  py-6 w-48 m-2"
              text="COMEÇAR ANÁLISE"
            />
          ) : null}
        </div>
      </main>
    );
  }
}
