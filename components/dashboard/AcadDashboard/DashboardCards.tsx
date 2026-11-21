'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cardsData } from './dashboard/cards-data';

const DashboardCards = () => {
  const [counts, setCounts] = useState(cardsData.map(() => 0));

  useEffect(() => {
    const timeoutIds = cardsData.map((item, index) =>
      setTimeout(() => setCounts((prevCounts) => {
        const newCounts = [...prevCounts];
        newCounts[index] = item.count;
        return newCounts;
      }), 300 * index)
    );
    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
      {cardsData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Card
            key={index}
            className={`w-full h-44 shadow-lg border-2 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:rotate-1 
                bg-gradient-to-br ${item.gradient} ${item.color} ${item.borderColor}`}
          >
            <CardHeader className="flex flex-col items-center justify-center h-full p-4 text-gray-800">
              <div className={`${item.color} p-2 rounded-full`}>
                <IconComponent className="h-8 w-8 text-gray-700" />
              </div>
              <CardTitle className="mt-2 text-lg font-semibold text-center">
                {item.title}
              </CardTitle>
              <div className="mt-2 text-2xl font-bold text-gray-900">
                {counts[index]}
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCards;