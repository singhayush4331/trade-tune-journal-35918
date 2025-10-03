
import { useToast, toast } from "@/hooks/use-toast";

// Configure default settings for toasts with reduced duration and limit
const originalToast = toast;

// Wrap toast with improved defaults and limits
const enhancedToast = Object.assign(
  // Preserve the original function signature
  (props: Parameters<typeof originalToast>[0]) => {
    // Set better defaults with shorter duration
    const toastProps = typeof props === 'string' 
      ? { description: props } 
      : props;
      
    return originalToast({
      duration: 1500, // Reduced from 2000ms to 1500ms for faster dismissal
      ...toastProps,
    });
  },
  // Copy all properties from the original toast object
  originalToast
);

export { useToast, enhancedToast as toast };
