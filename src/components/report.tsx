import { ReportData } from "@/app/page";

export interface ReportProps {
  data: ReportData;
}

export default function Report({ data }: ReportProps) {
  if (data.columns.length === 0) {
    return <div>No data</div>;
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            {data.columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((row, index) => (
            <tr key={index}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
