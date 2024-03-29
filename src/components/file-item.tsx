"use client";
import React, { useState, ChangeEvent, useRef } from "react";
import {
  FaRegTrashCan,
  FaFile,
  FaFileCircleExclamation,
  FaRegCircleCheck,
} from "react-icons/fa6";
import { Progress } from "./ui/progress";
import { Status } from "@/app/home/home";

interface FileItemProps {
  name: string;
  status: Status;
  size: number;
  onDelete: () => void;
  progress: number;
}

export default function FileItem({
  name,
  status,
  size,
  onDelete,
  progress,
}: FileItemProps) {
  const prettifySize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };
  const prettifyName = (name: string) => {
    if (name.length > 20) {
      return name.slice(0, 20) + "...";
    }
    return name;
  };
  const prettySize = prettifySize(size);
  const prettyName = prettifyName(name);
  const showProgress = progress && progress < 100;

  const icons = {
    ok: <FaFile className="text-white" />,
    pending: <FaFile className="text-muted-foreground" />,
    error: <FaFileCircleExclamation className="text-red-400" />,
  };

  return (
    <div className="flex flex-row items-center justify-between w-full max-w-[70%] px-4 py-2 border-2 rounded-md mb-2">
      <div className="flex items-center">
        {icons[status] || <FaFile className="text-muted-foreground" />}
      </div>
      {showProgress ? (
        <div className="flex items-center w-full  max-w-[40%]">
          <Progress value={progress} className="bg-secondary" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="leading-7 ml-2 text-sm">{prettyName}</p>
          <span className="text-xs font-medium leading-none text-muted-foreground">
            {size > 0 ? prettySize : ""}
          </span>
        </div>
      )}

      <div className="flex items-center">
        {status === "ok" ? (
          <FaRegCircleCheck className="text-green-success" />
        ) : (
          <FaRegTrashCan className="cursor-pointer" onClick={onDelete} />
        )}
      </div>
    </div>
  );
}
