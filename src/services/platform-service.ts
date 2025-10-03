
/**
 * Service for managing platform information
 */

// Default platform information
const platformInfo = {
  name: 'Wiggly',
  version: '1.0.0',
  features: ['Trade Tracking', 'Analytics', 'AI Assistant', 'Screenshots']
};

/**
 * Load platform information
 * @returns Platform information object
 */
export const loadPlatform = async () => {
  try {
    // In a real app, this might fetch from an API or config
    return platformInfo;
  } catch (error) {
    console.error('Error loading platform information:', error);
    return null;
  }
};
