import DOMPurify, { Config as DOMPurifyConfig } from 'dompurify';

/**
 * Secure HTML sanitizer utility to prevent XSS attacks
 * Uses DOMPurify to sanitize HTML content before rendering
 */

// Default configuration for general content
const DEFAULT_CONFIG: DOMPurifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table',
    'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'class', 'id', 'target', 'rel'
  ],
  ALLOW_DATA_ATTR: false,
  FORCE_BODY: true,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  SANITIZE_DOM: true
};

// Restrictive configuration for user-generated content
const RESTRICTIVE_CONFIG: DOMPurifyConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'code'],
  ALLOWED_ATTR: [],
  ALLOW_DATA_ATTR: false,
  FORCE_BODY: true,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  SANITIZE_DOM: true
};

// Very permissive config for trusted admin content (e.g., lesson content)
const TRUSTED_CONFIG: DOMPurifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table',
    'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'iframe', 'video',
    'audio', 'source'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'class', 'id', 'target', 'rel',
    'width', 'height', 'frameborder', 'allowfullscreen', 'controls',
    'autoplay', 'muted', 'loop'
  ],
  ALLOW_DATA_ATTR: false,
  FORCE_BODY: true,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM: false,
  SANITIZE_DOM: true
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - Raw HTML string to sanitize
 * @param config - Sanitization configuration level
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (
  html: string, 
  config: 'default' | 'restrictive' | 'trusted' = 'default'
): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitizeConfig: DOMPurifyConfig;
  
  switch (config) {
    case 'restrictive':
      sanitizeConfig = RESTRICTIVE_CONFIG;
      break;
    case 'trusted':
      sanitizeConfig = TRUSTED_CONFIG;
      break;
    default:
      sanitizeConfig = DEFAULT_CONFIG;
  }

  try {
    const sanitized = DOMPurify.sanitize(html, sanitizeConfig);
    
    // Additional validation to ensure we got a string back
    if (typeof sanitized !== 'string') {
      console.warn('DOMPurify returned non-string result, falling back to empty string');
      return '';
    }
    
    return sanitized;
  } catch (error) {
    console.error('HTML sanitization failed:', error);
    // In case of any error, return empty string for security
    return '';
  }
};

/**
 * React hook for safely setting innerHTML with sanitized content
 * @param html - Raw HTML string
 * @param config - Sanitization level
 * @returns Object with __html property for dangerouslySetInnerHTML
 */
export const useSanitizedHtml = (
  html: string, 
  config: 'default' | 'restrictive' | 'trusted' = 'default'
) => {
  const sanitizedHtml = sanitizeHtml(html, config);
  
  return {
    __html: sanitizedHtml
  };
};

/**
 * Sanitize content specifically for lesson/educational content (trusted sources)
 * Allows more HTML tags and attributes for rich content
 */
export const sanitizeLessonContent = (html: string): string => {
  return sanitizeHtml(html, 'trusted');
};

/**
 * Sanitize user-generated content with restrictive settings
 * Only allows basic formatting tags
 */
export const sanitizeUserContent = (html: string): string => {
  return sanitizeHtml(html, 'restrictive');
};

/**
 * Sanitize chat messages - allows basic formatting but prevents scripts
 */
export const sanitizeChatMessage = (html: string): string => {
  return sanitizeHtml(html, 'default');
};