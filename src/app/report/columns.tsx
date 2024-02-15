"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ReportData } from "../page";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  FaRegCircleCheck,
  FaCircleXmark,
  FaTriangleExclamation,
} from "react-icons/fa6";

import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ReportData>[] = [
  {
    header: "Status do Registro",
    accessorKey: "situacao_registro",
    cell: ({ row }) => {
      const value = row.getValue("situacao_registro") as string;
      switch (value) {
        case "APROVADO":
          return (
            <Badge variant="outline" className="text-green-600 rounded-full ">
              <span>{value}</span>
              <FaRegCircleCheck className="text-green-600 m-2" />
            </Badge>
          );
        case "REPROVADO":
          return (
            <Badge variant="outline" className="text-red-600 rounded-full">
              <span>{value}</span>
              <FaCircleXmark className="text-red-600 m-2" />
            </Badge>
          );
        case "VERIFICAR":
          return (
            <Badge variant="outline" className="text-yellow-600 rounded-full">
              <span>{value}</span>
              <FaTriangleExclamation className="text-yellow-400 m-2" />
            </Badge>
          );
        default:
          return <FaTriangleExclamation className="text-yellow-400 m-2" />;
      }
    },
    filterFn: (row, id, value) => {
      console.log(
        "Entrei no filterFn, row: ",
        row,
        "id: ",
        id,
        "value: ",
        value
      );
      return value.includes(row.getValue(id));
    },
  },
  {
    header: "Registro",
    accessorKey: "registro",
    cell: ({ row }) => {
      const value = row.getValue("registro") as string;
      return <span className="font-medium items-center">{value}</span>;
    },
  },
  {
    header: "Status da marca",
    accessorKey: "situacao_da_marca",
    cell: ({ row }) => {
      const value = row.getValue("situacao_da_marca") as string;
      return <span className="font-medium items-center">{value}</span>;
    },
  },
  {
    header: "Laboratório",
    accessorKey: "laboratorio",
    // prettify overflow text
    cell: ({ row }) => {
      const value = row.getValue("laboratorio") as string;
      const formattedValue =
        value.length > 20 ? `${value.slice(0, 20)}...` : value;
      return (
        <HoverCard>
          <HoverCardTrigger>{formattedValue}</HoverCardTrigger>
          <HoverCardContent>
            <p className="font-medium">{value}</p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    header: "Status do Preço",
    accessorKey: "situacao_do_preco",
  },
  {
    header: "Preço do Item",
    accessorKey: "preco_da_proposta",
  },
  {
    header: "Preço Tabelado",
    accessorKey: "preco_da_tabela",
    // prettify to brazilian price format
    cell: ({ row }) => {
      const value = row.getValue("preco_da_tabela") as string;
      return <span className="font-medium items-center">{value}</span>;
    },
  },
  {
    header: "Descrição do Item",
    accessorKey: "descricao_da_proposta",
    cell: ({ row }) => {
      const value = row.getValue("descricao_da_proposta") as string;
      const formattedValue =
        value.length > 20 ? `${value.slice(0, 20)}...` : value;
      return (
        <HoverCard>
          <HoverCardTrigger className="cursor-text">
            {formattedValue}
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="font-medium">{value}</p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    header: "Descrição Tabelada",
    accessorKey: "descricao_da_tabela",
    cell: ({ row }) => {
      const value = row.getValue("descricao_da_tabela") as string;
      const formattedValue =
        value.length > 20 ? `${value.slice(0, 20)}...` : value;
      return (
        <HoverCard>
          <HoverCardTrigger>{formattedValue}</HoverCardTrigger>
          <HoverCardContent>
            <p className="font-medium">{value}</p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
];
