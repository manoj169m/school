import React from 'react';
import { Bell, Calendar, AlertCircle } from 'lucide-react';

const reminders = [
  {
    id: 1,
    title: "Term Fee Due",
    dueDate: "2024-03-25",
    amount: 25000,
    class: "Class 10A",
    status: "Pending",
    students: 15,
  },
  {
    id: 2,
    title: "Lab Fee Due",
    dueDate: "2024-03-30",
    amount: 5000,
    class: "Class 11B",
    status: "Overdue",
    students: 8,
  },
  {
    id: 3,
    title: "Sports Fee Due",
    dueDate: "2024-04-05",
    amount: 3000,
    class: "Class 9C",
    status: "Pending",
    students: 12,
  },
];

export function BillReminders() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Bill Reminders</h3>
          <p className="text-sm text-gray-500 mt-1">Upcoming fee collections</p>
        </div>
        <Bell className="h-5 w-5 text-blue-600" />
      </div>
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${
              reminder.status === 'Overdue'
                ? 'border-red-200 bg-red-50'
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  {reminder.title}
                  {reminder.status === 'Overdue' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {reminder.students} students pending
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  reminder.status === 'Overdue'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                {reminder.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4" />
                <span>Due: {new Date(reminder.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>{reminder.class}</span>
                <span className="font-semibold">₹{reminder.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}