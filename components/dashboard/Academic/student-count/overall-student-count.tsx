"use client";

import { useState, useEffect } from "react";
import { BranchSelector } from "./branch-selector";
import { CountCard } from "./count-card";
import { Users, UserSquare, UserRound } from "lucide-react";
import { motion } from "framer-motion";

interface Branch {
  id: string;
  acronym: string;
}

interface Counts {
  total: number;
  boys: number;
  girls: number;
}

export function OverallStudentCount() {
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, boys: 0, girls: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch functions remain the same
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/branches');
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    fetchBranches();
  }, []);
  console.log(loading);
  

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/students/student-count?branchId=${selectedBranchId}`);
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
      setLoading(false);
    };
    fetchCounts();
  }, [selectedBranchId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8 bg-gradient-to-br from-custom-pink-50 via-white to-custom-pink-50 p-8 rounded-2xl shadow-xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-custom-red-600 mb-2">
            Overall Student Count
          </h2>
          <p className="text-gray-600 text-base">
            View student distribution across branches
          </p>
        </div>
        <BranchSelector
          branches={branches}
          selectedBranchId={selectedBranchId}
          onBranchChange={setSelectedBranchId}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CountCard
          label="Total Students"
          count={counts.total}
          icon={<Users className="h-6 w-6 text-white" />}
          gradientFrom="from-indigo-500"
          gradientVia="via-indigo-400"
          gradientTo="to-blue-300"
          iconClass="bg-indigo-600/30 backdrop-blur-md"
          textColor="text-white"
          hoverEffect="hover:from-indigo-600 hover:to-blue-400"
          delay={0}
        />
        <CountCard
          label="Boys"
          count={counts.boys}
          icon={<UserSquare className="h-6 w-6 text-white" />}
          gradientFrom="from-custom-pink-400"
          gradientVia="via-custom-pink-300"
          gradientTo="to-rose-200"
          iconClass="bg-custom-pink-400/30 backdrop-blur-md"
          textColor="text-white"
          hoverEffect="hover:from-custom-pink-350 hover:to-rose-300"
          delay={0.1}
        />
        <CountCard
          label="Girls"
          count={counts.girls}
          icon={<UserRound className="h-6 w-6 text-white" />}
          gradientFrom="from-emerald-500"
          gradientVia="via-emerald-400"
          gradientTo="to-teal-300"
          iconClass="bg-emerald-600/30 backdrop-blur-md"
          textColor="text-white"
          hoverEffect="hover:from-emerald-600 hover:to-teal-400"
          delay={0.2}
        />
      </div>
    </motion.div>
  );
}