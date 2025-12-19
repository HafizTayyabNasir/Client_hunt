import { Lead } from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const searchLeads = async (keyword: string, location: string): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_URL}/search?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as Lead[];
  } catch (error) {
    console.error("Failed to fetch leads from backend:", error);
    // Rethrow so the UI can handle it (or switch to simulation fallback if you prefer)
    throw error;
  }
};