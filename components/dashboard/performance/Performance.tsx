
import React from "react";
import MockTestResult from "./MockTestResult";
import ScoreChart from "./ScoreChart";
import SectionScoreChart from "./SectionScoreChart";
import ProgressChart from "./ProgressChart";
import TimeManagementChart from "./TimeManagementChart";
import AccuracyRate from "./AccuracyRate";
import SpeedAccuracyTradeOff from "./SpeedAccuracyTradeOff";
import ImprovementAreas from "./ImprovementAreas";

const Performance: React.FC = () => {
  const sectionData = [
    { name: "English", score: 186 },
    { name: "G Factor", score: 305 },
    { name: "General Knowledge", score: 237 },
    { name: "Quantitative Aptitude", score: 73 },
  ];

  return (
    <div title="Generate Question">
      <div className="p-10 bg-white min-h-screen space-y-12">

        {/* Mock Test Result Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <MockTestResult
            testName="SSC CGL Tier I Mock Test (2024)"
            correct={55}
            wrong={22}
            skipped={23}
            attempts={2}
            percentage={55}
          />
        

        {/* Score and Section Score Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-2 rounded-lg border-hidden">
          <ScoreChart correct={186} wrong={305} skipped={237} percentage={26} />
          <SectionScoreChart data={sectionData} />
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-2 rounded-lg border-hidden">
          <ProgressChart/>
        </div>

        <div className="bg-white p-2 rounded-lg border-hidden">
        <TimeManagementChart />
        </div>

        {/* Time Management, Accuracy Rate, and Speed-Accuracy Tradeoff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
          <AccuracyRate />
          <SpeedAccuracyTradeOff />
        </div>

        {/* Improvement Areas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <ImprovementAreas />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Performance;
