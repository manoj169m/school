import React from 'react';
import DashboardCards from './DashboardCards';
import ExamSchedule from './ExamSchedule';
import DashboardStats from './DashboardStats';
import TopPerformers from './TopPerformers';
import FocusAreas from './FocusAreas';


const AcadDashboard = () => {
  return (
    <div >
      <div className="p-4 md:p-6 space-y-6 max-w-full overflow-hidden">
        <DashboardCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <ExamSchedule />
          </div>
          
          <div className="lg:col-span-7 space-y-6">
            <DashboardStats />
            <TopPerformers />
            <FocusAreas />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcadDashboard;