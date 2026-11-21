import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const generateExcelReport = (
  data: any[],
  sheetName: string,
  fileName: string
) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}_${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
};