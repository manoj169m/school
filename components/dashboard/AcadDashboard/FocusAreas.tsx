import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { focusAreas } from './dashboard/focus-areas';

const FocusAreas = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Focus Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {focusAreas.map((area) => (
            <div
              key={area.id}
              className={`p-4 ${area.bgColor} rounded-lg hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <area.icon className={`h-5 w-5 ${area.color}`} />
                  <h3 className="font-semibold text-gray-800">{area.title}</h3>
                </div>
                <span className={`text-sm font-medium ${area.color} px-2 py-1 rounded-full bg-white`}>
                  {area.metric}
                </span>
              </div>
              <p className="text-sm text-gray-600">{area.description}</p>
              <div className={`mt-2 text-xs font-medium uppercase ${area.color}`}>
                {area.status}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusAreas;