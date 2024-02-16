import xlsx, { IJsonSheet } from "json-as-xlsx";
import { ReportData } from "@/app/page";
export function downloadToExcel(data: ReportData[]) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Relatorio-Audita",
      columns: [
        {
          label: "Registro",
          value: "registro",
        },
        {
          label: "Situação do Registro",
          value: "situacao_registro",
        },
        {
          label: "Laboratório",
          value: "laboratorio",
        },
        {
          label: "Situação da Marca",
          value: "situacao_da_marca",
        },
        {
          label: "Situação do Preço",
          value: "situacao_do_preco",
        },
        {
          label: "Preço da Proposta",
          value: "preco_da_proposta",
        },
        {
          label: "Preço da Tabela",
          value: "preco_da_tabela",
        },
        {
          label: "Descrição da Proposta",
          value: "descricao_da_proposta",
        },
        {
          label: "Descrição da Tabela",
          value: "descricao_da_tabela",
        },
      ],
      content: data,
    },
  ];
  let settings = {
    fileName: "Relatorio-Audita",
  };
  xlsx(columns, settings);
}
