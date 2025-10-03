
import React, { useState, useRef, useEffect } from 'react';
import { CandlestickChart, Search, Check, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getStockSuggestions, groupStocksByType } from '@/utils/stockNames';

interface IndianStockSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  hideLabel?: boolean; // New prop to control label visibility
}

const IndianStockSearch: React.FC<IndianStockSearchProps> = ({ value, onChange, className, hideLabel = false }) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Array<{ symbol: string; name: string; type: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update internal state when prop value changes
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // Handle clicks outside the component to hide suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input change and update suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue.trim()) {
      const newSuggestions = getStockSuggestions(newValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setHighlightedIndex(-1); // Reset highlighted index when input changes
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      if (newValue === '') {
        onChange('');
      }
    }
  };

  // Handle selection of a suggestion
  const handleSelectSuggestion = (suggestion: { symbol: string; name: string; type: string }) => {
    setInputValue(suggestion.symbol);
    onChange(suggestion.symbol);
    setShowSuggestions(false);
    
    // Unfocus the input
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsFocused(true);
    if (inputValue.trim()) {
      const newSuggestions = getStockSuggestions(inputValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    }
  };
  
  // Handle input blur
  const handleInputBlur = () => {
    setIsFocused(false);
    // Short delay to allow for click on suggestion
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only handle keyboard navigation if suggestions are shown
    if (!showSuggestions) return;
    
    const totalSuggestions = suggestions.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < totalSuggestions - 1 ? prev + 1 : 0));
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : totalSuggestions - 1));
        break;
        
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < totalSuggestions) {
          handleSelectSuggestion(suggestions[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
        
      default:
        break;
    }
  };

  // Group suggestions by type (just for display organization)
  const { indices, stocks } = groupStocksByType(suggestions);
  
  // Calculate if we should show the dropdown arrow
  const showDropdownArrow = isFocused || showSuggestions;

  return (
    <div className={cn("w-full space-y-1.5", className)} ref={containerRef}>
      {!hideLabel && (
        <Label className="text-sm font-medium flex items-center gap-1.5" htmlFor="stock-search">
          <CandlestickChart className="h-4 w-4 text-primary" />
          Stock Name/Symbol
        </Label>
      )}
      
      <div className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          
          <Input
            id="stock-search"
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search for stock or index..."
            className={cn(
              "pl-9 pr-8 py-2 w-full bg-background border border-input focus:border-primary transition-all",
              isFocused ? "ring-2 ring-ring ring-offset-1" : "",
              showSuggestions ? "rounded-b-none" : ""
            )}
            autoComplete="off"
          />
          
          {value && (
            <Check 
              className="absolute right-9 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" 
            />
          )}
          
          <ArrowDown 
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all",
              showDropdownArrow ? "opacity-100 text-primary" : "opacity-50 text-muted-foreground"
            )}
          />
        </div>
        
        {showSuggestions && (suggestions.length > 0) && (
          <div 
            ref={suggestionsRef}
            className="absolute left-0 right-0 z-50 mt-0 bg-card border border-input border-t-0 rounded-b-md shadow-md"
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            {/* Display all suggestions in a single list for simplicity */}
            <ul>
              {suggestions.map((item, idx) => {
                const isHighlighted = highlightedIndex === idx;
                return (
                  <li
                    key={`item-${idx}`}
                    className={cn(
                      "px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer flex justify-between items-center",
                      isHighlighted && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleSelectSuggestion(item)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{item.symbol}</span>
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-md">
                      {item.type}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndianStockSearch;
