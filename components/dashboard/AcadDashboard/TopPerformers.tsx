import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Star, BookOpen } from 'lucide-react';
import { toppers } from './dashboard/toppers-data';

const TopPerformers = () => {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Top Performers
          </CardTitle>
          <span className="text-sm text-gray-500">Last Updated: Today</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4 overflow-auto max-h-96">
          {toppers.map((topper) => {
            const BadgeIcon = topper.badge;
            return (
              <div
                key={topper.id}
                className={`${topper.bgColor} rounded-lg p-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
                        {topper.name.charAt(0).toUpperCase()}
                      </div>
                      <BadgeIcon
                        className={`h-5 w-5 ${topper.badgeColor} absolute -bottom-1 -right-1 bg-white rounded-full p-1`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{topper.name}</h3>
                      <p className="text-sm text-gray-600">{topper.grade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      {topper.percentage}%
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      {topper.improvement}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-600">Top Subjects:</span>
                    <span className="font-medium">{topper.subjects.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-600">Attendance:</span>
                    <span className="font-medium">{topper.attendanceRate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;