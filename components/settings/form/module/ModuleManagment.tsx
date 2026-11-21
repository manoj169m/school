import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleAccordion } from './ModuleAccordion';
import { items ,itemMaster } from '@/components/sidebar/SidebarData';

export function ModuleAccessManagement() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Module Access Management</h1>
      
      <div className=" flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Process Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <ModuleAccordion modules={items} type="process" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Master Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <ModuleAccordion modules={itemMaster} type="master" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}