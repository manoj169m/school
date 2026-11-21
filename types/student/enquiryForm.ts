// types/enquiryForm.ts

export interface EnquiryFormValues {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    dateOfBirth: string; // In the form, this will be a string (ISO date format)
    yearOfAdmission: number;
    admissionForGrade: string;
    enquiredByStaff: string;
    communicationNo: string;
    fatherNo: string;
    email: string;
    currentStudyingSchool: string;
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    state: string;
    cityTownVillage: string;
    status: string;
  }
  