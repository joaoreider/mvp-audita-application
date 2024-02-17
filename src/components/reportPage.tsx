import { ReportData } from "@/app/home/home";
import ReportTable from "@/app/report/ReportTable";

export interface ReportPageProps {
  data: ReportData[];
}
// Table component based on video: https://www.youtube.com/watch?v=Jgr8JjYOJsU
export default function ReportPage({ data }: ReportPageProps) {
  return (
    <div>
      <ReportTable data={data} />
    </div>
  );
}
