"use client";
import React, { useState, ChangeEvent, useRef } from "react";
import {
  FaRegTrashCan,
  FaFileCircleCheck,
  FaFileCircleExclamation,
} from "react-icons/fa6";
import { Progress } from "./ui/progress";
interface FileItemProps {
  name: string;
  status: boolean;
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

  return (
    <div className="flex items-center justify-between w-full max-w-[70%] px-4 py-2 border-2 rounded m-2">
      <div className="flex items-center">
        {status ? (
          <FaFileCircleCheck className="text-green-success" />
        ) : (
          <FaFileCircleExclamation className="text-red-400" />
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="leading-7 ml-2 text-sm">{prettyName}</p>
        <span className="text-xs font-medium leading-none text-muted-foreground">
          {prettySize}
        </span>
      </div>
      {progress ? (
        <div className="flex items-center w-full  max-w-[30%]">
          <Progress value={progress} className="bg-secondary" />
        </div>
      ) : null}
      <div className="flex items-center">
        <FaRegTrashCan className="cursor-pointer" onClick={onDelete} />
      </div>
    </div>
  );
}
