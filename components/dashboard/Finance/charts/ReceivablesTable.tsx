import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';

interface FeesDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockData = [
  {
    class: 'Class 10',
    section: 'A',
    totalStudents: 45,
    totalAmount: 450000,
    concession: 25000,
    dueAmount: 75000,
  },
  {
    class: 'Class 10',
    section: 'B',
    totalStudents: 42,
    totalAmount: 420000,
    concession: 20000,
    dueAmount: 65000,
  },
  {
    class: 'Class 11',
    section: 'A',
    totalStudents: 38,
    totalAmount: 480000,
    concession: 30000,
    dueAmount: 82000,
  },
  {
    class: 'Class 11',
    section: 'B',
    totalStudents: 40,
    totalAmount: 500000,
    concession: 28000,
    dueAmount: 79000,
  },
];

export function FeesDetailsDialog({ open, onOpenChange }: FeesDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-7xl h-[85vh] overflow-y-auto ">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Detailed Fee Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Select>
              <SelectTrigger className="pl-9 h-12">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Branch</SelectItem>
                <SelectItem value="north">North Campus</SelectItem>
                <SelectItem value="south">South Campus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Select>
              <SelectTrigger className="pl-9 h-12">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2023-2024</SelectItem>
                <SelectItem value="2023">2022-2023</SelectItem>
                <SelectItem value="2022">2021-2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Select>
              <SelectTrigger className="pl-9 h-12">
                <SelectValue placeholder="Fee Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tuition">Tuition Fee</SelectItem>
                <SelectItem value="transport">Transport Fee</SelectItem>
                <SelectItem value="library">Library Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-lg">
          <div className="overflow-x-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-200 to-gray-300">
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Class</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Section</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Total Students</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Total Amount</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Concession</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Due Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((row, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-100 transition-all"
                    >
                      <TableCell className="text-base text-gray-700 p-4">{row.class}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">{row.section}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">{row.totalStudents}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">₹{row.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">₹{row.concession.toLocaleString()}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">₹{row.dueAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
