// Define time slots and patterns for the school schedule
export const TIME_SLOTS = [
  '8:00 - 8:45', '8:45 - 9:30', '9:30 - 10:15',
  '10:15 - 11:00', '11:15 - 12:00', '12:00 - 12:45',
  '12:45 - 1:30', '2:15 - 3:00', '3:00 - 3:45',
  '3:45 - 4:30'
] as const;

export const FREE_PERIOD_PATTERNS = {
  'Monday': [2, 7], // 8:45-9:30 and 12:45-1:30
  'Tuesday': [3, 8], // 9:30-10:15 and 2:15-3:00
  'Wednesday': [4, 9], // 10:15-11:00 and 3:00-3:45
  'Thursday': [1, 6], // 8:00-8:45 and 12:00-12:45
  'Friday': [5, 10] // 11:15-12:00 and 3:45-4:30
} as const;