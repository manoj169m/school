import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { statsData } from './dashboard/stats-data';

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3 bg-white">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-50 p-4 rounded-b-lg">
            <div className="mt-2">
              <div className="text-4xl font-bold text-gray-800">{stat.count}</div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-base text-gray-600">{stat.description}</span>
                <div className="flex items-center gap-1 text-green-600 text-base font-medium">
                  <TrendingUp className="h-4 w-4" />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Previous: {stat.previousCount}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;