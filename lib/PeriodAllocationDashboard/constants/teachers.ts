export interface Teacher {
  id: string;
  name: string;
  subject: string;
  department: string;
}

export const TEACHERS: Teacher[] = [
  { id: '1', name: 'Ms. Rodriguez', subject: 'Language', department: 'Languages' },
  { id: '2', name: 'Mr. Thompson', subject: 'English', department: 'Languages' },
  { id: '3', name: 'Mrs. Patel', subject: 'Mathematics', department: 'Sciences' },
  { id: '4', name: 'Dr. Wilson', subject: 'Science', department: 'Sciences' },
  { id: '5', name: 'Ms. Clark', subject: 'Social Science', department: 'Humanities' },
  { id: '6', name: 'Mr. Johnson', subject: 'Physical Training', department: 'Sports' },
  { id: '7', name: 'Ms. Lee', subject: 'Drawing', department: 'Arts' }
];