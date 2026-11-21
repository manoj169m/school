// Define the form values used in the form component
export interface StudentStatusFormValues {
    academicYear: string;   // Selected academic year
    branches: string[];     // Array of selected branch IDs
    classes: string[];      // Array of selected class IDs
    sections: string[];     // Array of selected section IDs
    status: string;         // Student status (active/inactive)
  }
  
  // Define the transformed values that will be sent to the API
  export interface FormValues {
    academicYearId: string; // ID of the selected academic year
    branchIds: string[];    // Array of selected branch IDs
    classIds: string[];     // Array of selected class IDs
    sectionIds: string[];   // Array of selected section IDs
    status: string;         // Student status (active/inactive)
  }
  
  // Define the select option interface used in the form
  export interface SelectOption {
    value: string;
    label: string;
  }
  
  // Define loading states for different form sections
  export interface LoadingState {
    academicYears: boolean;
    branches: boolean;
    classes: boolean;
    sections: boolean;
  }
  
  // Define the possible status options
  export const StatusOptions: SelectOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];