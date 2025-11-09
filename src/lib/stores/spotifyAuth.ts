import { writable, get } from 'svelte/store';

interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
  images?: Array<{ url: string }>;
}

interface SpotifyAuthState {
  user: SpotifyUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: SpotifyAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Create the store
function createSpotifyAuthStore() {
  const { subscribe, set, update } = writable<SpotifyAuthState>(initialState);

  // Try to restore from localStorage on init
  if (typeof localStorage !== 'undefined') {
    const savedToken = localStorage.getItem('spotify_token');
    const savedRefreshToken = localStorage.getItem('spotify_refresh_token');
    
    if (savedToken) {
      update(state => ({
        ...state,
        accessToken: savedToken,
        refreshToken: savedRefreshToken,
        isAuthenticated: true
      }));
    }
  }

  return {
    subscribe,
    
    // Fetch user profile
    fetchUserProfile: async (accessToken: string) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const user = await response.json();
        
        update(state => ({
          ...state,
          user,
          isAuthenticated: true,
          isLoading: false
        }));
        
        return user;
      } catch (error) {
        update(state => ({
          ...state,
          error: error.message,
          isLoading: false
        }));
        throw error;
      }
    },
    
    // Handle auth message from popup
    handleAuthMessage: async (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'spotify_auth_success') {
        const { code, codeVerifier } = event.data;
        
        update(state => ({ ...state, isLoading: true, error: null }));
        
        try {
          // Exchange code for token
          const response = await fetch('/api/spotify/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, codeVerifier })
          });
          
          if (!response.ok) {
            throw new Error('Token exchange failed');
          }
          
          const tokenData = await response.json();
          
          // Store tokens
          localStorage.setItem('spotify_token', tokenData.access_token);
          if (tokenData.refresh_token) {
            localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
          }
          
          // Update store
          update(state => ({
            ...state,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            isAuthenticated: true
          }));
          
          // Fetch user profile
          await get(spotifyAuth).fetchUserProfile(tokenData.access_token);
          
        } catch (error) {
          update(state => ({
            ...state,
            error: error.message,
            isLoading: false
          }));
        }
      } else if (event.data.type === 'spotify_auth_error') {
        update(state => ({
          ...state,
          error: event.data.error,
          isLoading: false
        }));
      }
    },
    
    // Logout
    logout: () => {
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_refresh_token');
      set(initialState);
    },
    
    // Reset error
    clearError: () => {
      update(state => ({ ...state, error: null }));
    }
  };
}

// Export singleton instance
export const spotifyAuth = createSpotifyAuthStore();
