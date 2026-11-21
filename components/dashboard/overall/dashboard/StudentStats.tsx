import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  UserSquare,
  UserRound,
} from "lucide-react";
import { BranchSelector } from "./branchSelector";
import { CountCard } from "./studentcountcard";

export default function StudentStats() {
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [branches, setBranches] = useState([]);
  const [counts, setCounts] = useState({ total: 0, boys: 0, girls: 0 });
  const [enrollmentStats, setEnrollmentStats] = useState({
    enquiry: 0,
    admitted: 0,
    dropout: 0,
  });
  const [loading, setLoading] = useState(true);
  console.log(loading);
  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Fetch student counts based on selected branch
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/students/student-count?branchId=${selectedBranchId}`
        );
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
      setLoading(false);
    };
    fetchCounts();
  }, [selectedBranchId]);

  // Fetch enrollment statistics
  useEffect(() => {
    const fetchEnrollmentStats = async () => {
      try {
        const response = await fetch("/api/students/enrollment-stats");
        const data = await response.json();
        setEnrollmentStats(data);
      } catch (error) {
        console.error("Error fetching enrollment stats:", error);
      }
    };
    fetchEnrollmentStats();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* First Card - 8/12 of the screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-7 bg-gradient-to-br from-rose-100 via-rose-50 to-white p-4 rounded-xl border border-rose-200"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <BranchSelector
            branches={branches}
            selectedBranchId={selectedBranchId}
            onBranchChange={setSelectedBranchId}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBranchId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <CountCard
              label="Total"
              count={counts.total}
              icon={<Users className="h-3 w-3 text-rose-600" />}
              color="bg-gradient-to-br from-rose-200 via-rose-100 to-white"
              delay={0}
            />
            <CountCard
              label="Boys"
              count={counts.boys}
              icon={<UserSquare className="h-3 w-3 text-blue-600" />}
              color="bg-gradient-to-br from-blue-200 via-blue-100 to-white"
              delay={0.1}
            />
            <CountCard
              label="Girls"
              count={counts.girls}
              icon={<UserRound className="h-3 w-3 text-pink-600" />}
              color="bg-gradient-to-br from-pink-200 via-pink-100 to-white"
              delay={0.2}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Second Card - 4/12 of the screen */}
      <Card className="col-span-5 p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30">
        <div className="grid grid-cols-3 gap-4">
          <div className="group bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 rounded-xl text-center hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <UserPlus className="h-6 w-6 text-emerald-500 mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-sm font-medium text-muted-foreground">Enquiry</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {enrollmentStats.enquiry}
            </p>
          </div>

          <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-xl text-center hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <UserCheck className="h-6 w-6 text-blue-500 mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-sm font-medium text-muted-foreground">
              Admitted
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {enrollmentStats.admitted}
            </p>
          </div>

          <div className="group bg-gradient-to-br from-rose-500/10 to-red-500/10 p-4 rounded-xl text-center hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <UserMinus className="h-6 w-6 text-rose-500 mx-auto mb-2 group-hover:rotate-12 transition-transform duration-300" />
            <p className="text-sm font-medium text-muted-foreground">Dropout</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {enrollmentStats.dropout}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
