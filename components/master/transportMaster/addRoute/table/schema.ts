export interface Stop {
  stopNumber: number;
  stopName: string;
  distance: string;
  landMark: string;
}

export interface Vehicle {
  vehicleNumber: string;
  regNo: string;
}

export interface AcademicYear {
  label: string;
}

export interface Route {
  id: number;
  routeName: string;
  numberOfStops: number;
  academicYearId: number;
  vehicleId: number;
  vehicle: Vehicle; // Added vehicle information
  academicYear: AcademicYear; // Added academic year information
  stops: Stop[]; // Added stops as an array of Stop objects
}


