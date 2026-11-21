"use client";

import { VehicleCard } from "./vehicle-card";
import { ClasswiseTransportCard } from "./classwise-transport-card";
import { DashboardHeader } from "./dashboard-header/dashboard-header";
import { resetIdCounter } from "@/lib/transportDashboard/utils/id-generator";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuoteBanner } from "./dashboard-header/quote-banner";
import { Building2 } from "lucide-react";

// Reset ID counter on component mount to ensure consistent IDs
resetIdCounter();

interface Branch {
  id: number;
  name: string;
  acronym: string;
}

export function TransportDashboard() {
  const [selectedBranch, setSelectedBranch] = useState<number | "all">("all");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const getSelectedBranchName = () => {
      if (selectedBranch === "all") return "";
      const branch = branches.find((b) => b.id === selectedBranch);
      return branch?.name || "";
    };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("/api/branches");
        setBranches(response.data);
        setSelectedBranch("all"); // Set 'all' as default
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("Failed to fetch branches");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value === "all" ? "all" : parseInt(value));
  };

  if (loading) {
    return (
      <div className="mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      <QuoteBanner />
      <div className="mb-4 flex items-center justify-end gap-2 bg-white/50 p-2 rounded-lg">
        <Building2 className="h-5 w-5 text-rose-500" />
        <Select
          value={selectedBranch === "all" ? "all" : selectedBranch.toString()}
          onValueChange={handleBranchChange}
        >
          <SelectTrigger className="w-[200px] border-rose-200 bg-white">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id.toString()}>
                {branch.acronym}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DashboardHeader branchId={selectedBranch} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <VehicleCard
          branchId={selectedBranch}
          branchName={getSelectedBranchName()}
        />
        <ClasswiseTransportCard
          branchId={selectedBranch}
          branchName={getSelectedBranchName()}
        />
      </div>
    </div>
  );
}
