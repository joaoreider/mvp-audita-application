import { ReportData } from "@/app/page";
import ReportTable from "@/app/report/page";

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
