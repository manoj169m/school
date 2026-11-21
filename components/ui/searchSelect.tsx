'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

type SearchSelectProps<T> = {
  options: T[];
  value?: T | null;
  onChange: (value: T | null) => void;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string | number;
  filterOption?: (option: T, searchTerm: string) => boolean;
  renderOption?: (option: T) => React.ReactNode;
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
};

function SearchSelect<T>({
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  filterOption,
  renderOption,
  placeholder = 'Select...',
  label,
  required = false,
  error,
  disabled = false,
  className = '',
}: SearchSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const defaultFilterOption = (option: T, term: string) => 
    getOptionLabel(option).toLowerCase().includes(term.toLowerCase());

  const filteredOptions = options.filter(option => 
    (filterOption || defaultFilterOption)(option, searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        setIsEditing(false);
        setHighlightedIndex(-1);
        setSearchTerm('');
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const options = optionsRef.current.getElementsByClassName('option-item');
      const highlighted = options[highlightedIndex] as HTMLElement;
      if (highlighted) {
        highlighted.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : prev
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          onChange(filteredOptions[highlightedIndex]);
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
          setIsFocused(false);
          setIsEditing(false);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        setIsFocused(false);
        setIsEditing(false);
        setSearchTerm('');
        break;
      
      case 'Tab':
        setIsOpen(false);
        setHighlightedIndex(-1);
        setIsFocused(false);
        setIsEditing(false);
        setSearchTerm('');
        break;
    }
  };

  const renderOptionContent = (option: T) => {
    if (renderOption) {
      return renderOption(option);
    }
    return (
      <>
        <span className="text-gray-900">
          {getOptionLabel(option)}
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <ChevronDown className="w-4 h-4 text-blue-500 transform -rotate-90" />
        </span>
      </>
    );
  };

  const containerClasses = `
    relative w-full text-sm
    ${className}
  `;

  const labelClasses = `
    block text-sm font-medium
    mb-2 mt-1
    ${error ? 'text-red-500' : 'text-blue-700'}
    transition-colors duration-200
  `;

  const selectContainerClasses = `
    relative flex items-center w-full 
    px-3 py-2 h-10
    border rounded-lg
    shadow-sm
    transition-all duration-200 ease-in-out
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer bg-white'}
    ${error 
      ? 'border-red-300 hover:border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200' 
      : isFocused
        ? 'border-blue-500 ring-2 ring-blue-100'
        : 'border-gray-300 hover:border-gray-400'}
  `;

  const dropdownClasses = `
    absolute z-50 w-full 
    mt-1 py-2
    bg-white rounded-lg
    border border-gray-200
    shadow-lg
    max-h-60 overflow-auto
    transform transition-all duration-200 ease-out
    ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
  `;

  const getOptionClasses = (index: number) => `
    option-item
    px-2 py-1
    cursor-pointer
    text-sm leading-5
    transition-colors duration-150
    ${index === highlightedIndex ? 'bg-blue-50' : 'hover:bg-blue-50'}
    flex items-center justify-between
    group
  `;

  return (
    <div className={containerClasses} ref={dropdownRef}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" onKeyDown={handleKeyDown}>
        <div
          className={selectContainerClasses}
          onClick={() => {
            if (!disabled) {
              setIsOpen(true);
              setIsFocused(true);
              setIsEditing(true);
              setSearchTerm(value ? getOptionLabel(value) : '');
              // Use setTimeout to ensure input gets focused after state updates
              setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
              }, 0);
            }
          }}
        >
          {!value && !isEditing && (
            <Search className="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" />
          )}
          
          <div className="flex-grow relative">
            {value && !isEditing ? (
              <div className="flex items-center justify-between">
                <span className="block truncate font-medium text-gray-900">
                  {getOptionLabel(value)}
                </span>
                {!disabled && (
                  <button
                    type="button"
                    className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(null);
                      setSearchTerm('');
                      setIsEditing(false);
                    }}
                    aria-label="Clear selection"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            ) : (
              <input
                ref={inputRef}
                type="text"
                className="w-full border-none p-0 focus:ring-0 focus:outline-none placeholder-gray-400 bg-transparent text-sm"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsEditing(true);
                }}
                onClick={(e) => e.stopPropagation()}
                onFocus={() => {
                  setIsFocused(true);
                  setIsEditing(true);
                  if (!disabled) {
                    setIsOpen(true);
                  }
                }}
                disabled={disabled}
                aria-label={label || 'Search'}
              />
            )}
          </div>
          
          <ChevronDown 
            className={`
              w-4 h-4 ml-2 flex-shrink-0
              transition-transform duration-200
              ${isOpen ? 'transform rotate-180 text-blue-500' : 'text-gray-400'}
              ${disabled ? 'text-gray-300' : ''}
            `}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>
        )}

        <div className={dropdownClasses} ref={optionsRef}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={getOptionValue(option)}
                className={getOptionClasses(index)}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchTerm('');
                  setHighlightedIndex(-1);
                  setIsFocused(false);
                  setIsEditing(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                {renderOptionContent(option)}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}      
        </div>
      </div>
    </div>
  );
}

export default SearchSelect;