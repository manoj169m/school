import { Calendar, UserPlus, FileQuestion, ClipboardCheck, TrendingUp, AlertCircle } from 'lucide-react';

export const focusAreas = [
  {
    id: 1,
    title: 'Exam Schedule',
    icon: Calendar,
    status: 'urgent',
    metric: '2 pending',
    description: 'Mid-term exams need scheduling',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 2,
    title: 'Admissions',
    icon: UserPlus,
    status: 'active',
    metric: '15 new',
    description: 'New applications to review',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 3,
    title: 'Question Bank',
    icon: FileQuestion,
    status: 'attention',
    metric: '50 needed',
    description: 'Physics questions needed',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 4,
    title: 'Test Results',
    icon: ClipboardCheck,
    status: 'pending',
    metric: '3 pending',
    description: 'Results pending review',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 5,
    title: 'Performance Analysis',
    icon: TrendingUp,
    status: 'review',
    metric: '5 classes',
    description: 'Monthly review pending',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 6,
    title: 'Urgent Actions',
    icon: AlertCircle,
    status: 'critical',
    metric: '2 items',
    description: 'Requires immediate attention',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
];