import React from "react";
import ReportDataTable from "./data-table";
import { columns } from "./columns";
import { ReportData } from "../home/home";

type Props = {
  data: ReportData[];
};

const ReportTable = ({ data }: Props) => {
  return <ReportDataTable columns={columns} data={data} />;
};

export default ReportTable;
