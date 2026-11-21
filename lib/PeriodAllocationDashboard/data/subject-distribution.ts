import { Standard, STANDARDS, SUBJECTS } from '../constants/education';

export interface SubjectDistributionData {
  standard: Standard;
  distribution: {
    subject: string;
    periodsPerWeek: number;
  }[];
}

export function getSubjectDistribution(): SubjectDistributionData[] {
  return STANDARDS.map(standard => {
    // Adjust periods based on class level
    const isJunior = ['LKG', 'UKG', '1st', '2nd'].includes(standard);
    const isMiddle = ['3rd', '4th', '5th', '6th'].includes(standard);
    
    const distribution = SUBJECTS.map(subject => {
      let periodsPerWeek = 5; // Default periods per week

      // Adjust distribution based on class level and subject
      if (isJunior) {
        switch (subject) {
          case 'Language':
          case 'Mathematics':
            periodsPerWeek = 8;
            break;
          case 'Physical Training':
          case 'Drawing':
          case 'Music':
            periodsPerWeek = 3;
            break;
          case 'Computer Science':
          case 'Library':
            periodsPerWeek = 2;
            break;
        }
      } else if (isMiddle) {
        switch (subject) {
          case 'Mathematics':
          case 'Science':
            periodsPerWeek = 7;
            break;
          case 'Language':
          case 'English':
            periodsPerWeek = 6;
            break;
          case 'Physical Training':
          case 'Computer Science':
            periodsPerWeek = 3;
            break;
          case 'Drawing':
          case 'Music':
          case 'Library':
            periodsPerWeek = 2;
            break;
        }
      } else {
        // Senior classes
        switch (subject) {
          case 'Mathematics':
          case 'Science':
          case 'English':
            periodsPerWeek = 8;
            break;
          case 'Social Science':
            periodsPerWeek = 6;
            break;
          case 'Language':
            periodsPerWeek = 5;
            break;
          case 'Computer Science':
            periodsPerWeek = 4;
            break;
          case 'Physical Training':
            periodsPerWeek = 3;
            break;
          case 'Drawing':
          case 'Music':
          case 'Library':
            periodsPerWeek = 2;
            break;
        }
      }

      return {
        subject,
        periodsPerWeek
      };
    });

    return {
      standard,
      distribution
    };
  });
}