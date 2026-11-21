'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Teacher, TEACHERS } from '@/lib/PeriodAllocationDashboard/constants/teachers';
import { Day, DAYS } from '@/lib/PeriodAllocationDashboard/constants/education';


interface TeacherSelectorProps {
  onSelectionChange: (selection: {
    teacher: Teacher | null;
    day: Day | null;
  }) => void;
}

export function TeacherSelector({ onSelectionChange }: TeacherSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null);
  const [selectedDay, setSelectedDay] = React.useState<Day | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredTeachers = React.useMemo(() => {
    if (!searchQuery) return TEACHERS;
    const query = searchQuery.toLowerCase();
    return TEACHERS.filter(
      teacher => 
        teacher.name.toLowerCase().includes(query) || 
        teacher.subject.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpen(false);
    onSelectionChange({ teacher, day: selectedDay });
  };

  const handleDaySelect = (day: Day) => {
    setSelectedDay(day);
    onSelectionChange({ teacher: selectedTeacher, day });
  };

  return (
    <div className="flex gap-4 mb-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[280px] justify-between"
          >
            {selectedTeacher ? selectedTeacher.name : "Select teacher..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4">
          <div className="space-y-4">
            <input
              className="w-full px-3 py-2 text-sm border rounded-md"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-[300px] overflow-auto space-y-2">
              {filteredTeachers.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2">
                  No teachers found
                </div>
              ) : (
                filteredTeachers.map((teacher) => (
                  <Button
                    key={teacher.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleTeacherSelect(teacher)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTeacher?.id === teacher.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{teacher.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({teacher.subject})
                    </span>
                  </Button>
                ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Select
        onValueChange={handleDaySelect}
        disabled={!selectedTeacher}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select day" />
        </SelectTrigger>
        <SelectContent>
          {DAYS.map((day) => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}