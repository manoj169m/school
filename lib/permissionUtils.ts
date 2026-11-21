export type Permission = {
    read?: boolean;
    write?: boolean;
    delete?: boolean;
    create?: boolean;
  };
  
  export type ModulePermissions = {
    [key: string]: Permission; // Key is the module name
  };
  
  export type DepartmentPermissions = {
    [key: string]: ModulePermissions; // Key is the department name
  };
  
  export type UserPermissions = {
    userId: string;
    departmentId: string;
    overrides: ModulePermissions; // Override department permissions for specific users
  };




export const checkModuleAccess = (
    moduleKey: string,
    userPermissions: UserPermissions,
    departmentPermissions: DepartmentPermissions
  ): Permission => {
    // First check user-specific overrides
    if (userPermissions.overrides[moduleKey]) {
      return userPermissions.overrides[moduleKey];
    }
  
    // Then check department permissions
    const deptPerms = departmentPermissions[userPermissions.departmentId];
    return deptPerms?.[moduleKey] || { read: false, write: false, delete: false, create: false };
  };
  

  export const sampleDepartmentPermissions: DepartmentPermissions = {
    "ACADEMIC": {
      "Students": { read: true, write: true },
      "Academics": { read: true, write: true },
      "Finance": { read: true },
      "Employee": { read: true }
    },
    "FINANCE": {
      "Students": { read: true },
      "Finance": { read: true, write: true, delete: true, create: true },
      "Employee": { read: true }
    },
    "ADMIN": {
      "Students": { read: true, write: true, delete: true, create: true },
      "Academics": { read: true, write: true, delete: true, create: true },
      "Finance": { read: true, write: true, delete: true, create: true },
      "Employee": { read: true, write: true, delete: true, create: true }
    }
  };
  