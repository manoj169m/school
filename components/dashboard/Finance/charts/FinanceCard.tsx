import React, { useState } from "react";
import { CreditCard, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

// Define the type for finance card data
interface FinanceCardData {
  icon: JSX.Element;
  title: string;
  value: string;
}

// Sample finance data
const financeCards: FinanceCardData[] = [
  {
    icon: <Wallet className="text-blue-500" size={48} />,
    title: "Total Balance",
    value: "₹45,678.92"
  },
  {
    icon: <TrendingUp className="text-green-500" size={48} />,
    title: "Monthly Income",
    value: "₹6,245.00"
  },
  {
    icon: <PiggyBank className="text-purple-500" size={48} />,
    title: "Today's Income",
    value: "₹4,123.50"
  },
  {
    icon: <CreditCard className="text-yellow-500" size={48} />,
    title: "Today's Expenses",
    value: "₹32,245"
  }
];

// Sample mock data for the table
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

export function FinanceCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<FinanceCardData | null>(null); // Use the FinanceCardData type

  // Handle card click to open the modal
  const handleCardClick = (card: FinanceCardData) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  // Handle close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {financeCards.map((card, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all cursor-pointer"
            onClick={() => handleCardClick(card)}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {card.icon}
            </div>
            {/* Title and Value */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with table */}
      {isModalOpen && selectedCard && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-7xl h-[85vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-background z-10 pb-6">
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Detailed Finance Analysis
              </DialogTitle>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-base">Class</TableHead>
                    <TableHead className="font-semibold text-base">Section</TableHead>
                    <TableHead className="font-semibold text-base">Total Students</TableHead>
                    <TableHead className="font-semibold text-base">Total Amount</TableHead>
                    <TableHead className="font-semibold text-base">Concession</TableHead>
                    <TableHead className="font-semibold text-base">Due Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-base">{row.class}</TableCell>
                      <TableCell className="text-base">{row.section}</TableCell>
                      <TableCell className="text-base">{row.totalStudents}</TableCell>
                      <TableCell className="text-base">₹{row.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-base">₹{row.concession.toLocaleString()}</TableCell>
                      <TableCell className="text-base">₹{row.dueAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
