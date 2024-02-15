"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ReportData } from "../page";

export const columns: ColumnDef<ReportData>[] = [
  {
    header: "Registro",
    accessorKey: "registro",
  },
  {
    header: "Situação registro",
    accessorKey: "situacao_registro",
  },
  {
    header: "Situação da marca",
    accessorKey: "situacao_da_marca",
  },
  {
    header: "Situação do preço",
    accessorKey: "situacao_do_preco",
  },
  {
    header: "Laboratório",
    accessorKey: "laboratorio",
  },
  {
    header: "Preço da proposta",
    accessorKey: "preco_da_proposta",
  },
  {
    header: "Preço da tabela",
    accessorKey: "preco_da_tabela",
  },
  {
    header: "Descrição da proposta",
    accessorKey: "descricao_da_proposta",
  },
  {
    header: "Descrição da tabela",
    accessorKey: "descricao_da_tabela",
  },
];
