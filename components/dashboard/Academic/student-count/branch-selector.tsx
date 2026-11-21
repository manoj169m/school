"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

interface Branch {
  id: string;
  acronym: string;
}

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
}

export function BranchSelector({
  branches,
  selectedBranchId,
  onBranchChange,
}: BranchSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-white/50 p-2 rounded-lg">
      <Building2 className="h-5 w-5 text-rose-500" />
      <Select value={selectedBranchId} onValueChange={onBranchChange}>
        <SelectTrigger className="w-[200px] border-rose-200 bg-white">
          <SelectValue placeholder="Select branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Branches</SelectItem>
          {branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.acronym}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}