import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, } from 'lucide-react';
import { useState } from 'react';
import { PermissionListDialog } from './EmployeeList';

interface EmployeePermission {
  id: string;
  name: string;
  hasAccess: boolean;
}

const employees = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Mike Johnson' },
];

interface ModulePermissionButtonProps {
  moduleTitle: string;
  subItemTitle: string;
  subItemID: number;
  type: 'process' | 'master';
}

export function ModulePermissionButton({
  moduleTitle,
  subItemTitle,
  type,
}: ModulePermissionButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [permissions, setPermissions] = useState<EmployeePermission[]>([]);

  // Filter out employees who already have permissions
  const availableEmployees = employees.filter(
    emp => !permissions.some(perm => perm.id === emp.id)
  );

  const handlePermissionGrant = () => {
    if (selectedEmployee) {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      if (employee) {
        setPermissions([
          ...permissions,
          { id: employee.id, name: employee.name, hasAccess: true }
        ]);
        setSelectedEmployee('');
      }
    }
  };

  const handlePermissionRemove = (employeeId: string) => {
    setPermissions(permissions.filter(permission => permission.id !== employeeId));
  };

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-custom-pink-250"
          >
            <Shield className="h-4 w-4 mr-2" />
            Permissions
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-slate-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              Module Access Management
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3 p-4 rounded-lg bg-slate-50">
              <h4 className="font-medium text-custom-red-600">Module Information</h4>
              <div className="text-sm text-custom-red-600 space-y-1">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Type:</span> 
                  <span className="px-2 py-1">{type}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Module:</span> 
                  <span className="px-2 py-1">{moduleTitle}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Feature:</span> 
                  <span className="px-2 py-1">{subItemTitle}</span>
                </p>
              </div>
            </div>

           

            {/* Grant New Permission Section */}
            {availableEmployees.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Grant Access To</label>
                <Select onValueChange={setSelectedEmployee} value={selectedEmployee}>
                  <SelectTrigger className="border-slate-200 hover:border-blue-300">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.map((employee) => (
                      <SelectItem 
                        key={employee.id} 
                        value={employee.id}
                        className="hover:bg-blue-50"
                      >
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handlePermissionGrant} 
                  disabled={!selectedEmployee}
                  className="w-full bg-custom-red-600 hover:bg-custom-pink-250 text-white mt-2"
                >
                  Grant Access
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PermissionListDialog
        moduleTitle={moduleTitle}
        subItemTitle={subItemTitle}
        type={type}
        permissions={permissions}
        onPermissionRemove={handlePermissionRemove}
      />
    </div>
  );
}