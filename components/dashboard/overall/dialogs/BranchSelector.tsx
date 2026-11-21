"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { School } from "lucide-react";

interface Branch {
  id: string;
  name: string;
}

interface BranchSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBranchSelect: (branch: string) => void;
}

export function BranchSelectionDialog({
  open,
  onOpenChange,
  onBranchSelect,
}: BranchSelectionDialogProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranches() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/branches");
        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }
        const data = await response.json();
        setBranches(data);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchBranches();
    }
  }, [open]);

  const handleBranchSelect = (value: string) => {
    setSelectedBranch(value);
    onBranchSelect(value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <School className="h-6 w-6 text-blue-500" />
            Select School Branch
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Select value={selectedBranch} onValueChange={handleBranchSelect}>
            <SelectTrigger className="w-full h-14 text-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300">
              <SelectValue placeholder="Choose a branch" />
            </SelectTrigger>
            <SelectContent>
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SelectItem value="loading" disabled>
                      Loading branches...
                    </SelectItem>
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SelectItem value="error" disabled>
                      {error}
                    </SelectItem>
                  </motion.div>
                )}
                {!loading &&
                  !error &&
                  branches.map((branch) => (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SelectItem
                        value={branch.id}
                        className="p-4 text-base hover:bg-blue-50 cursor-pointer transition-all duration-200 flex items-center gap-2"
                      >
                        <School className="h-4 w-4 text-blue-500" />
                        {branch.name}
                      </SelectItem>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
