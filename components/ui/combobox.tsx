"use client"

import * as React from "react"
import { ChevronsUpDown, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface Option {
  value: string
  label: string
}

interface MultiSelectComboboxProps {
  options: Option[]
  placeholder?: string
  searchPlaceholder?: string
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function MultiSelectCombobox({
  options,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  value,
  onChange,
  disabled = false,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState<number>(0)

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.getBoundingClientRect().width)
    }
  }, [open])

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  const handleRemove = (optionValue: string) => {
    onChange(value.filter((v) => v !== optionValue))
  }

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white"
            disabled={disabled}
          >
            <span className="truncate">
              {value.length === 0 ? placeholder : `${value.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          align="start" 
          className="p-0"
          style={{ width: `${width}px` }}
        >
          <Command className="w-full">
            <CommandInput 
              placeholder={searchPlaceholder} 
              className="w-full"
            />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-2 cursor-pointer",
                        isSelected ? "bg-red-50/50" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div 
                          className={cn(
                            "w-4 h-4 border rounded flex items-center justify-center",
                            isSelected 
                              ? "border-red-400" 
                              : "border-gray-300"
                          )}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-red-400" />
                          )}
                        </div>
                        <span className={cn(
                          "font-medium",
                          isSelected ? "text-red-500" : "text-gray-700"
                        )}>
                          {option.label}
                        </span>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLabels.map((label, index) => (
            <Badge
              key={label}
              variant="secondary"
              className="flex items-center gap-1 bg-red-50 text-red-500 hover:bg-red-100"
            >
              {label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRemove(value[index])
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleRemove(value[index])}
              >
                <X className="h-3 w-3 text-red-400 hover:text-red-600" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}