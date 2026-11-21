export async function fetchBranchClassSections(
    academicYearId?: number, 
    branchId?: number, 
    classId?: number
  ) {
    try {
      // Construct query parameters dynamically
      const params = new URLSearchParams();
      if (academicYearId) params.append('academicYearId', academicYearId.toString());
      if (branchId) params.append('branchId', branchId.toString());
      if (classId) params.append('classId', classId.toString());
  
      // Fetch data from the API
      const response = await fetch(`/api/models/cascading-selects?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch branch class sections');
      }
  
      const data = await response.json();
  
      // Return structured data
      return {
        academicYears: data.academicYears || [],
        branches: data.branches || [],
        classes: data.classes || [],
        sections: data.sections || []
      };
    } catch (error) {
      console.error('Error in fetchBranchClassSections:', error);
      return {
        academicYears: [],
        branches: [],
        classes: [],
        sections: []
      };
    }
  }
  
  export async function fetchAccounts() {
    try {
      const response = await fetch('/api/accounts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
  }
  
  export async function fetchFeeCategories() {
    try {
      const response = await fetch('/api/feeCategory');
      
      if (!response.ok) {
        throw new Error('Failed to fetch fee categories');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching fee categories:', error);
      return [];
    }
  }