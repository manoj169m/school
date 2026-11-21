import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { ModulePermissionButton } from './ModulePermission';
import { LucideIcon } from 'lucide-react';

interface SubItem {
  title: string;
  url: string;
  id: number;
}

interface Module {
  title: string;
  icon: LucideIcon;
  subItems: SubItem[];
}

interface ModuleAccordionProps {
  modules: Module[];
  type: 'process' | 'master';
}

export function ModuleAccordion({ modules, type }: ModuleAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 shadow-lg">
      {modules.map((module, index) => (
        <AccordionItem 
          key={index} 
          value={`item-${index}`}
          className="border border-slate-200 rounded-lg mb-2 overflow-hidden hover:border-custom-pink-50 transition-colors"
        >
          <AccordionTrigger className="hover:no-underline px-4 py-3 bg-white hover:bg-custom-pink-50 ">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-custom-pink-200 text-custom-red-600">
                <module.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-slate-700">{module.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-white">
            <div className="space-y-1 p-2">
              {module.subItems.map((subItem, subIndex) => (
                <div
                  key={subIndex}
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm text-slate-600 font-medium">{subItem.title}</span>
                  <ModulePermissionButton
                    moduleTitle={module.title}
                    subItemTitle={subItem.title}
                    type={type}
                    subItemID={subItem.id}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
