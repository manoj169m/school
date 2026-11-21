// components/ScoreChart.tsx
'use client';
import React, {  useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Sector } from "recharts";

interface ScoreChartProps {
  correct: number;
  wrong: number;
  skipped: number;
  percentage: number;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ correct, wrong, skipped, percentage }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const data = [
    { name: "Correct", value: correct, color: "#34D399" },
    { name: "Wrong", value: wrong, color: "#60A5FA" },
    { name: "Skipped", value: skipped, color: "#F87171" },
  ];

  console.log(setActiveIndex);
  
  interface ActiveShapeProps {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: { name: string };
    value: number;
  }

  const renderActiveShape = (props:unknown) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,  //payload
      value,
    } = props as ActiveShapeProps;  
   

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill='black'  className='text-bold'>
          {value}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={10}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 1}
          outerRadius={outerRadius + 12}
          fill={fill}
          cornerRadius={10}

        />
        
      </g>
    );
  };


  // const onPieEnter = useCallback((_:DataEntry, index:number) => {
  //   setActiveIndex(index);
  // }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center">
      <div className="text-left">
      <h2 className="text-lg font-semibold">Overall Score</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Congratulations on your {percentage}%! Use this as a stepping stone to build on and keep pushing towards your goal.
      </p>
      </div>
      <PieChart width={300} height={300} >
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <div className="flex justify-around gap-4 mt-4 w-full">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#34D399" }}></span>
          Correct - {correct}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#60A5FA" }}></span>
          Wrong - {wrong}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#F87171" }}></span>
          Skipped - {skipped}
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
