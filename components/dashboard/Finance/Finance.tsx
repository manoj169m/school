'use client';
import {  Receivables } from './charts/Receivables';
import { BillReminders } from './charts/Reminder';
import { FinanceCard } from './charts/FinanceCard';
import ExpensesGraph from './charts/ExpensesGraph';
import ClassAttendanceBarChart from './charts/FinanceBarChart';
  // Make sure to import your ClassAttendanceBarChart component

const YourComponent = () => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Left Column */}
      <div className="col-span-12 md:col-span-4 space-y-5">
        <Receivables/>
        <BillReminders />
      </div>

      {/* Right Column */}
      <div className="col-span-12 md:col-span-8 space-y-5">
        <FinanceCard />
        <ExpensesGraph />
        <ClassAttendanceBarChart />
      </div>
    </div>
  );
};

export default YourComponent;
