
import { mockTrades, generateMockTrades } from "@/data/mockTradeData";
import { Trade } from "@/utils/trade-form-types";
import { toast } from "sonner";
import { mockPlaybooks, generateMockPlaybooks } from "@/data/mockPlaybookData";
import { Playbook } from "@/services/playbooks-service";

// Keys for storing mock data in localStorage
const MOCK_DATA_KEY = "trade-journal-mock-data";
const MOCK_PLAYBOOKS_KEY = "trade-journal-mock-playbooks";
// Key for tracking if mock data has been initialized
const MOCK_DATA_INITIALIZED_KEY = "trade-journal-mock-data-initialized";
// Key to track if notifications have been shown during the session
const MOCK_DATA_NOTIFICATIONS_KEY = "trade-journal-mock-data-notifications";
// Key to track if user has intentionally cleared data in this session
const MOCK_DATA_CLEARED_SESSION_KEY = "trade-journal-mock-data-cleared-session";

/**
 * Initializes mock trade data for trial users
 * @returns {boolean} Whether initialization was successful
 */
export const initializeMockData = (): boolean => {
  try {
    console.log("Initializing mock trade data for trial user");
    
    // Clear any existing data first to ensure clean state
    localStorage.removeItem(MOCK_DATA_KEY);
    localStorage.removeItem(MOCK_PLAYBOOKS_KEY);
    
    // Clear the session flag since we're intentionally initializing
    sessionStorage.removeItem(MOCK_DATA_CLEARED_SESSION_KEY);
    
    // First generate and store playbooks (needs to happen before trades)
    const generatedPlaybooks = generateMockPlaybooks();
    localStorage.setItem(MOCK_PLAYBOOKS_KEY, JSON.stringify(generatedPlaybooks));
    
    // Update the in-memory mockPlaybooks array immediately
    mockPlaybooks.length = 0; // Clear existing
    mockPlaybooks.push(...generatedPlaybooks);
    
    console.log(`Generated and stored ${generatedPlaybooks.length} mock playbooks`);
    
    // Then generate trades (which will use the playbook strategies)
    const generatedTrades = generateMockTrades();
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(generatedTrades));
    
    // Update the in-memory mockTrades array immediately
    mockTrades.length = 0; // Clear existing
    mockTrades.push(...generatedTrades);
    
    console.log(`Generated and stored ${generatedTrades.length} mock trades`);
    
    // Mark as initialized
    localStorage.setItem(MOCK_DATA_INITIALIZED_KEY, "true");
    
    // Dispatch events to notify components immediately
    window.dispatchEvent(new CustomEvent('mockDataInitialized'));
    window.dispatchEvent(new CustomEvent('playbookDataUpdated'));
    window.dispatchEvent(new CustomEvent('tradeDataUpdated'));
    
    console.log(`Successfully initialized ${generatedTrades.length} mock trades and ${generatedPlaybooks.length} mock playbooks`);
    
    return true;
  } catch (error) {
    console.error("Failed to initialize mock data:", error);
    toast.error("Failed to initialize demo data");
    return false;
  }
};

/**
 * Removes all mock trade data
 * @returns {boolean} Whether removal was successful
 */
export const removeMockData = (): boolean => {
  try {
    console.log("Removing all mock trade data");
    
    // Set session flag to indicate user has intentionally cleared data
    sessionStorage.setItem(MOCK_DATA_CLEARED_SESSION_KEY, "true");
    
    // Clear from localStorage - this is the key fix
    localStorage.removeItem(MOCK_DATA_KEY);
    localStorage.removeItem(MOCK_PLAYBOOKS_KEY);
    localStorage.removeItem(MOCK_DATA_INITIALIZED_KEY); // This prevents auto-recovery
    
    // Clear the in-memory mockTrades array
    mockTrades.length = 0;
    
    // Clear the in-memory mockPlaybooks array
    mockPlaybooks.length = 0;
    
    // Dispatch events to notify components
    window.dispatchEvent(new CustomEvent('mockDataRemoved'));
    window.dispatchEvent(new CustomEvent('playbookDataUpdated'));
    window.dispatchEvent(new CustomEvent('tradeDataUpdated'));
    
    // Only show success toast if not triggered by reset operation
    const isResetOperation = sessionStorage.getItem('mock_data_reset_in_progress') === 'true';
    if (!isResetOperation) {
      toast.success("Demo data removed successfully", { duration: 3000 });
    }
    
    return true;
  } catch (error) {
    console.error("Failed to remove mock data:", error);
    toast.error("Failed to remove demo data");
    return false;
  }
};

/**
 * Checks if mock data is currently initialized
 */
export const isMockDataInitialized = (): boolean => {
  return localStorage.getItem(MOCK_DATA_INITIALIZED_KEY) === "true";
};

/**
 * Checks if user has intentionally cleared data in this session
 */
const hasUserClearedDataThisSession = (): boolean => {
  return sessionStorage.getItem(MOCK_DATA_CLEARED_SESSION_KEY) === "true";
};

/**
 * Loads mock data from localStorage into memory
 */
export const loadMockData = (): void => {
  try {
    // Don't load if user has cleared data this session
    if (hasUserClearedDataThisSession()) {
      console.log("User has cleared data this session, skipping load");
      return;
    }

    // First load playbooks (needs to happen before trades)
    const storedPlaybookData = localStorage.getItem(MOCK_PLAYBOOKS_KEY);
    if (storedPlaybookData) {
      const playbooks: Playbook[] = JSON.parse(storedPlaybookData);
      
      // Clear and update the in-memory mockPlaybooks array
      mockPlaybooks.length = 0;
      mockPlaybooks.push(...playbooks);
      console.log(`Loaded ${mockPlaybooks.length} mock playbooks`);
    }
    
    // Then load trades which may reference the playbooks
    const storedTradeData = localStorage.getItem(MOCK_DATA_KEY);
    if (storedTradeData) {
      const trades: Trade[] = JSON.parse(storedTradeData);
      
      // Clear and update the in-memory mockTrades array
      mockTrades.length = 0;
      mockTrades.push(...trades);
      console.log(`Loaded ${mockTrades.length} mock trades`);
    }
  } catch (error) {
    console.error("Failed to load mock data from localStorage:", error);
  }
};

/**
 * Force initialization of mock data even if already initialized
 * Updated to ensure proper ordering and synchronization between playbooks and trades
 */
export const forceInitializeMockData = (): boolean => {
  try {
    console.log("Force initializing mock data");
    
    // Set a flag to prevent multiple notifications during the reset process
    sessionStorage.setItem('mock_data_reset_in_progress', 'true');
    
    // Clear existing mock data first
    removeMockData();
    
    // Clear the session flag since we're force initializing
    sessionStorage.removeItem(MOCK_DATA_CLEARED_SESSION_KEY);
    
    // First generate and store playbooks
    const generatedPlaybooks = generateMockPlaybooks();
    localStorage.setItem(MOCK_PLAYBOOKS_KEY, JSON.stringify(generatedPlaybooks));
    
    // Update the in-memory mockPlaybooks array immediately
    mockPlaybooks.length = 0; // Clear existing
    mockPlaybooks.push(...generatedPlaybooks);
    
    console.log(`Generated and stored ${generatedPlaybooks.length} mock playbooks`);
    
    // Then generate trades that reference those playbooks
    const generatedTrades = generateMockTrades();
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(generatedTrades));
    
    // Update the in-memory mockTrades array immediately
    mockTrades.length = 0; // Clear existing
    mockTrades.push(...generatedTrades);
    
    console.log(`Generated and stored ${generatedTrades.length} mock trades using playbook strategies`);
    
    // Mark as initialized
    localStorage.setItem(MOCK_DATA_INITIALIZED_KEY, "true");
    
    // Dispatch events in the correct order - first playbooks, then trades
    window.dispatchEvent(new CustomEvent('playbookDataUpdated'));
    window.dispatchEvent(new CustomEvent('mockDataInitialized'));
    window.dispatchEvent(new CustomEvent('tradeDataUpdated'));
    
    // Clear the reset flag
    sessionStorage.removeItem('mock_data_reset_in_progress');
    
    // Show a single success toast
    toast.success("Demo data refreshed successfully", { duration: 3000 });
    
    return true;
  } catch (error) {
    console.error("Failed to force initialize mock data:", error);
    toast.error("Failed to initialize demo data");
    sessionStorage.removeItem('mock_data_reset_in_progress');
    return false;
  }
};

/**
 * Check if we should use mock data (during trial period)
 * @param isTrialActive Whether the user is in trial period
 */
export const shouldUseMockData = (isTrialActive: boolean): boolean => {
  const shouldUse = isTrialActive && isMockDataInitialized();
  console.log('shouldUseMockData check:', { isTrialActive, hasInitialized: isMockDataInitialized(), shouldUse });
  return shouldUse;
};

// Auto-initialize mock data for trial users with enhanced logic
export const autoInitializeForTrialUser = (isTrialActive: boolean): boolean => {
  if (!isTrialActive) return false;
  
  // Don't auto-initialize if user has cleared data this session
  if (hasUserClearedDataThisSession()) {
    console.log("User has cleared data this session, skipping auto-initialization");
    return false;
  }
  
  const hasInitialized = isMockDataInitialized();
  if (hasInitialized) {
    console.log('Mock data already initialized for trial user');
    return true;
  }
  
  console.log("Auto-initializing mock data for trial user");
  const success = initializeMockData();
  
  if (success) {
    console.log("Auto-initialization completed successfully");
    // Show welcome message for new trial users
    setTimeout(() => {
      toast.success("Welcome! We've loaded some demo trades to help you explore the platform.", { 
        duration: 5000 
      });
    }, 1000);
  }
  
  return success;
};

// Force reload of mock data when the service is imported
// to ensure we have the latest data - but only if user hasn't cleared it
loadMockData();

// Auto recovery logic - only run if user hasn't intentionally cleared data
if (!hasUserClearedDataThisSession()) {
  // If mock data is initialized but playbooks are empty, 
  // this ensures they're properly loaded
  if (isMockDataInitialized() && mockPlaybooks.length === 0) {
    const generatedPlaybooks = generateMockPlaybooks();
    mockPlaybooks.push(...generatedPlaybooks);
    localStorage.setItem(MOCK_PLAYBOOKS_KEY, JSON.stringify(generatedPlaybooks));
  }

  // If mock data is initialized but trades are empty,
  // this ensures they're properly loaded with the playbook strategies
  if (isMockDataInitialized() && mockTrades.length === 0 && mockPlaybooks.length > 0) {
    const generatedTrades = generateMockTrades();
    mockTrades.push(...generatedTrades);
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(generatedTrades));
  }
}
