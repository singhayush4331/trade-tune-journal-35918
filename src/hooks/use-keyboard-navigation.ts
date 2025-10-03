
import { useEffect, useCallback } from 'react';

interface KeyboardNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onToggleSidebar: () => void;
  onMarkComplete: () => void;
  disabled?: boolean;
}

export const useKeyboardNavigation = ({
  onPrevious,
  onNext,
  onToggleSidebar,
  onMarkComplete,
  disabled = false
}: KeyboardNavigationProps) => {
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (disabled) return;
    
    // Don't trigger if user is typing in an input field
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return;
    }

    // Only trigger if no modifier keys are pressed (except for specific combinations)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      // Allow Ctrl/Cmd + specific keys
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        onToggleSidebar();
        return;
      }
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        onPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onNext();
        break;
      case ' ':
        event.preventDefault();
        onMarkComplete();
        break;
      case 'Escape':
        onToggleSidebar();
        break;
    }
  }, [onPrevious, onNext, onToggleSidebar, onMarkComplete, disabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};
