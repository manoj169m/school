import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BadgePercent, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectContent 
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { FeeData, FeeDetail } from "@/types/income";
import { useToast } from "@/hooks/use-toast";


interface ConcessionCategory {
  id: number;
  name: string;
}

export function ConcessionDialog({
  isOpen,
  onClose,
  feeData,
  feeDetails,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  feeData: FeeData;
  feeDetails: FeeDetail[];
  onSuccess?: () => void;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ConcessionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [concessionAmounts, setConcessionAmounts] = useState<{ [key: string]: string }>({});
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/concessions/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleConcessionChange = (accountId: number, term: string, value: string) => {
    const key = `${accountId}-${term}`;
    const numValue = parseFloat(value);
    const feeDetail = feeDetails.find(
      detail => detail.accountId === accountId && detail.term === term
    );

    if (!feeDetail) return;

    // Clear previous errors for this input
    const newInputErrors = { ...inputErrors };
    delete newInputErrors[key];

    if (value && isNaN(numValue)) {
      newInputErrors[key] = "Please enter a valid number";
    } else if (numValue < 0) {
      newInputErrors[key] = "Amount cannot be negative";
    } else if (numValue > feeDetail.pending) {
      newInputErrors[key] = `Cannot exceed pending amount (₹${feeDetail.pending})`;
    }

    setInputErrors(newInputErrors);
    setConcessionAmounts({ ...concessionAmounts, [key]: value });
  };

  const onSubmit = async () => {
    if (Object.keys(inputErrors).length > 0) {
      setError("Please fix all errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      if (!selectedCategory) {
        setError("Please select a concession category");
        return;
      }

      const concessions = Object.entries(concessionAmounts)
        .map(([key, amount]) => {
          const [accountId, term] = key.split('-');
          return {
            accountId: parseInt(accountId),
            term,
            amount: parseFloat(amount) || 0,
            description: remark
          };
        })
        .filter(c => c.amount > 0);

      if (concessions.length === 0) {
        setError("Please enter at least one concession amount");
        return;
      }

      const response = await fetch('/api/concessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentFeeId: feeData.studentFeeId,
          academicYearId: feeData.academicYearId,
          branchId: feeData.branchId,
          classId: feeData.classId,
          sectionId: feeData.sectionId,
          concessionCategoryId: parseInt(selectedCategory),
          concessions
        })
      });

      if (!response.ok) throw new Error('Failed to submit concessions');
      
      toast({
        title: "Success",
        description: "Concession has been updated successfully",
        className: "bg-green-50 border-green-600 text-green-800",
      });
      
      // Call onSuccess callback before closing the dialog
      await onSuccess?.();
      onClose();
      
      // Reset form state
      setSelectedCategory("");
      setRemark("");
      setConcessionAmounts({});
      setInputErrors({});
      
    } catch (error) {
      console.error('Error submitting concessions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update concession. Please try again.',
        className: 'bg-red-50 border-red-600 text-red-800',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 rounded-xl shadow-2xl bg-white flex flex-col max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 p-6 rounded-t-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <BadgePercent className="w-8 h-8 text-white" />
              <DialogTitle className="text-2xl font-semibold text-white">
                Update Concession
              </DialogTitle>
            </div>
            <DialogDescription className="text-blue-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Managing concessions for {feeData.studentDetails.name}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card className="overflow-hidden border-none shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableHead className="py-4 text-center font-semibold text-gray-700">Account Name</TableHead>
                    <TableHead className="py-4 text-center font-semibold text-gray-700">Term</TableHead>
                    <TableHead className="py-4 text-center font-semibold text-gray-700">Amount</TableHead>
                    <TableHead className="py-4 text-center font-semibold text-gray-700">Current Concession</TableHead>
                    <TableHead className="py-4 text-center font-semibold text-gray-700">Paid</TableHead>
                    <TableHead className="py-4 text-center font-semibold text-gray-700">Pending</TableHead>
                    <TableHead className="py-4 text-center font-semibold text-gray-700">New Concession</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeDetails.map((item, index) => {
                    const inputKey = `${item.accountId}-${item.term}`;
                    const hasError = inputErrors[inputKey];
                    
                    return (
                      <TableRow 
                        key={inputKey}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <TableCell className="text-center font-medium">{item.accountName}</TableCell>
                        <TableCell className="text-center">{item.term}</TableCell>
                        <TableCell className="text-center">₹{item.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-center">₹{item.concession.toFixed(2)}</TableCell>
                        <TableCell className="text-center">₹{item.paid.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-medium text-blue-600">
                          ₹{item.pending.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Input
                              value={concessionAmounts[inputKey] || ''}
                              onChange={(e) => handleConcessionChange(item.accountId, item.term, e.target.value)}
                              className={`w-32 text-center focus-visible:ring-0 focus-visible:ring-offset-0${
                                hasError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                              }`}
                              placeholder={`Max ₹${item.pending}`}
                              
                              min="0"
                              step="0.01"
                              max={item.pending}
                            />
                            {hasError && (
                              <span className="text-xs text-red-500">{hasError}</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Concession Category *
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Remark
                </label>
                <Input
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter remark (optional)"
                  className="bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isLoading || Object.keys(inputErrors).length > 0}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? 'Processing...' : 'Update Concession'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConcessionDialog;