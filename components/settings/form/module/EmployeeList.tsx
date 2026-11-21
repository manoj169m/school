import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserX, Users } from 'lucide-react';
import { useState } from 'react';

interface PermissionListProps {
  moduleTitle: string;
  subItemTitle: string;
  type: 'process' | 'master';
  permissions: Array<{
    id: string;
    name: string;
    hasAccess: boolean;
  }>;
  onPermissionRemove: (employeeId: string) => void;
}

export function PermissionListDialog({
  moduleTitle,
  subItemTitle,
  type,
  permissions,
  onPermissionRemove,
}: PermissionListProps) {
  const [open, setOpen] = useState(false);
  const activePermissions = permissions.filter(p => p.hasAccess);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-custom-pink-250"
        >
          <Users className="h-4 w-4 mr-2" />
          View Access List
          {activePermissions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
              {activePermissions.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-slate-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Access List
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">Employees with Access</h4>
              <span className="text-sm text-slate-500">
                {activePermissions.length} employee(s)
              </span>
            </div>
            {activePermissions.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {permission.name}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPermissionRemove(permission.id)}
                      className="text-xs px-2 text-slate-600 hover:text-red-600 flex items-center gap-1"
                    >
                      <UserX className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500">
                No employees have access to this module
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}