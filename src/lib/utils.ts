import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats large numbers using Indian numbering system
 * Examples: 
 * - 12500 => ₹12.5K
 * - 150000 => ₹1.5L
 * - 10000000 => ₹1Cr
 */
export function formatIndianCurrency(value: string | number): string {
  // If value is already a string and contains non-numeric characters, assume it's formatted
  if (typeof value === 'string' && !/^[-+]?\d+(\.\d+)?$/.test(value.replace('₹', ''))) {
    return value;
  }
  
  // Convert to number for processing
  const numValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^\d.-]/g, ''))
    : value;
  
  // Format based on magnitude using Indian system
  if (Math.abs(numValue) >= 10000000) {
    // 1 Crore and above
    return `₹${(numValue / 10000000).toFixed(1)}Cr`;
  } else if (Math.abs(numValue) >= 100000) {
    // 1 Lakh and above
    return `₹${(numValue / 100000).toFixed(1)}L`;
  } else if (Math.abs(numValue) >= 1000) {
    // 1 Thousand and above
    return `₹${(numValue / 1000).toFixed(1)}K`;
  } else {
    // Regular formatting for smaller numbers
    return `₹${numValue.toLocaleString('en-IN')}`;
  }
}

/**
 * Enhanced parser to convert markdown to formatted text
 * This handles basic markdown like *italic*, **bold**, # headers, tables, etc.
 */
export const parseMarkdown = (text: string): string => {
  if (!text) return '';
  
  // Handle headers (###, ##, #)
  text = text.replace(/###\s+(.+)(\n|$)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  text = text.replace(/##\s+(.+)(\n|$)/g, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>');
  text = text.replace(/#\s+(.+)(\n|$)/g, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');
  
  // Handle bold (**text**)
  text = text.replace(/\*\*(.+?)\*\*/g, '<span class="font-bold">$1</span>');
  
  // Handle italic (*text*)
  text = text.replace(/\*([^*]+)\*/g, '<span class="italic">$1</span>');
  
  // Also handle single asterisks for bold (common in AI outputs)
  // Only do this for patterns like *word* that are clearly meant for emphasis
  text = text.replace(/(?<!\*)\*([^\s*][^*]*[^\s*])\*(?!\*)/g, '<span class="font-bold">$1</span>');
  
  // Handle lists
  text = text.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ml-4">• $1</li>');
  text = text.replace(/^\s*-\s+(.+)$/gm, '<li class="ml-4">• $1</li>');
  
  // Handle tables - this is the main addition
  // First, identify table blocks by looking for lines that start with | and contain multiple |
  const tableRegex = /(\|.*\|.*\n)+/g;
  text = text.replace(tableRegex, (match) => {
    // Split the table into rows
    const rows = match.trim().split('\n');
    
    // Check if we have a header row with dashes
    const hasHeader = rows.length > 1 && rows[1].match(/\|[-:|]+\|/);
    
    // Start building the HTML table
    let tableHtml = '<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-border/40 rounded-md">';
    
    rows.forEach((row, rowIndex) => {
      // Skip separator row (the one with dashes)
      if (hasHeader && rowIndex === 1 && row.match(/\|[-:|]+\|/)) {
        return;
      }
      
      // Clean up the row content
      const cells = row
        .split('|')
        .filter((cell, i, arr) => i !== 0 && i !== arr.length - 1 || cell.trim() !== '') // Remove empty cells at start/end
        .map(cell => cell.trim());
      
      if (cells.length > 0) {
        tableHtml += '<tr>';
        cells.forEach((cell, cellIndex) => {
          const isHeader = hasHeader && rowIndex === 0;
          const tag = isHeader ? 'th' : 'td';
          const cellClass = isHeader 
            ? 'px-3 py-2 bg-primary/10 text-primary-foreground font-semibold border border-border/40 text-center'
            : 'px-3 py-2 border border-border/40 text-center ' + (rowIndex % 2 ? 'bg-muted/30' : '');
          
          tableHtml += `<${tag} class="${cellClass}">${cell}</${tag}>`;
        });
        tableHtml += '</tr>';
      }
    });
    
    tableHtml += '</table></div>';
    return tableHtml;
  });
  
  // Handle paragraphs and line breaks
  text = text.split('\n\n').map(paragraph => {
    if (!paragraph.trim()) return '';
    if (paragraph.startsWith('<h') || paragraph.startsWith('<li') || paragraph.startsWith('<div')) return paragraph;
    return `<p class="my-2">${paragraph}</p>`;
  }).join('');
  
  // Handle line breaks
  text = text.replace(/\n/g, '<br />');
  
  return text;
};
