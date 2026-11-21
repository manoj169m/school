'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Day, DAYS, Section, SECTIONS, Standard, STANDARDS } from '@/lib/PeriodAllocationDashboard/constants/education';


interface ClassSelectorProps {
  onSelectionChange: (selection: {
    standard: Standard | null;
    section: Section| null;
    day: Day | null;
  }) => void;
}

export function ClassSelector({ onSelectionChange }: ClassSelectorProps) {
  const [standard, setStandard] = useState<Standard | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [day, setDay] = useState<Day | null>(null);

  const handleStandardChange = (value: Standard) => {
    setStandard(value);
    setSection(null);
    onSelectionChange({ standard: value, section: null, day });
  };

  const handleSectionChange = (value: Section) => {
    setSection(value);
    onSelectionChange({ standard, section: value, day });
  };

  const handleDayChange = (value: Day) => {
    setDay(value);
    onSelectionChange({ standard, section, day: value });
  };

  return (
    <div className="flex gap-4 mb-6">
      <Select onValueChange={handleStandardChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Standard" />
        </SelectTrigger>
        <SelectContent>
          {STANDARDS.map((std) => (
            <SelectItem key={std} value={std}>
              {std} Standard
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={handleSectionChange}
        disabled={!standard}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Section" />
        </SelectTrigger>
        <SelectContent>
          {SECTIONS.map((sec) => (
            <SelectItem key={sec} value={sec}>
              Section {sec}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={handleDayChange}
        disabled={!standard || !section}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Day" />
        </SelectTrigger>
        <SelectContent>
          {DAYS.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}