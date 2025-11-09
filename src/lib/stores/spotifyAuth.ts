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
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const savedToken = localStorage.getItem('spotify_token');
    const savedRefreshToken = localStorage.getItem('spotify_refresh_token');
    
    if (savedToken) {
      console.log('🔄 Restoring saved Spotify token from localStorage');
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
      console.log('📡 Fetching user profile with token:', accessToken.substring(0, 20) + '...');
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Failed to fetch user profile:', response.status, errorText);
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }
        
        const user = await response.json();
        console.log('✅ User profile fetched successfully:', user.display_name);
        
        update(state => ({
          ...state,
          user,
          isAuthenticated: true,
          isLoading: false
        }));
        
        return user;
      } catch (error: any) {
        console.error('❌ Error fetching user profile:', error);
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
      console.log('📨 Received message:', event.data);
      
      // Verify origin for security
      if (event.origin !== window.location.origin) {
        console.warn('⚠️ Message from different origin, ignoring:', event.origin);
        return;
      }
      
      if (event.data.type === 'spotify_auth_success') {
        const { code, returnedState } = event.data;
        console.log('✅ Auth success message received');
        console.log('📝 Code:', code?.substring(0, 20) + '...');
        console.log('📝 Returned state:', returnedState);
        
        // Set loading state
        update(state => ({ ...state, isLoading: true, error: null }));

        // Validate state against sessionStorage in parent
        const storedState = sessionStorage.getItem('spotify_auth_state');
        console.log('📝 Stored state:', storedState);
        
        if (returnedState !== storedState) {
          const errorMsg = `State mismatch! returned: ${returnedState}, stored: ${storedState}`;
          console.error('❌', errorMsg);
          update(state => ({
            ...state,
            error: 'Authentication failed: State mismatch',
            isLoading: false
          }));
          return;
        }
        
        console.log('✅ State validation passed');

        // Get code verifier from sessionStorage
        const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
        console.log('📝 Code verifier:', codeVerifier?.substring(0, 20) + '...');
        
        if (!codeVerifier) {
          console.error('❌ Code verifier not found in sessionStorage');
          update(state => ({
            ...state,
            error: 'Code verifier not found',
            isLoading: false
          }));
          return;
        }
        
        try {
          console.log('🔄 Exchanging code for tokens...');
          
          // Exchange code for token
          const response = await fetch('/api/spotify/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, codeVerifier })
          });
          
          console.log('📡 Token exchange response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Token exchange failed:', response.status, errorData);
            throw new Error(`Token exchange failed: ${response.status}`);
          }
          
          const tokenData = await response.json();
          console.log('✅ Token exchange successful');
          console.log('📝 Access token received:', tokenData.access_token?.substring(0, 20) + '...');
          console.log('📝 Refresh token received:', tokenData.refresh_token ? 'Yes' : 'No');
          
          // Store tokens in localStorage
          try {
            localStorage.setItem('spotify_token', tokenData.access_token);
            console.log('✅ Access token saved to localStorage');
            
            if (tokenData.refresh_token) {
              localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
              console.log('✅ Refresh token saved to localStorage');
            }
          } catch (storageError) {
            console.error('❌ Failed to save to localStorage:', storageError);
          }
          
          // Update store
          update(state => ({
            ...state,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || null,
            isAuthenticated: true,
            isLoading: false
          }));
          
          console.log('✅ Store updated with tokens');
          
          // Clean up sessionStorage
          sessionStorage.removeItem('spotify_auth_state');
          sessionStorage.removeItem('spotify_code_verifier');
          console.log('🧹 Cleaned up sessionStorage');
          
          // Fetch user profile
          console.log('🔄 Fetching user profile...');
          await get(spotifyAuth).fetchUserProfile(tokenData.access_token);
          
        } catch (error: any) {
          console.error('❌ Error in handleAuthMessage:', error);
          update(state => ({
            ...state,
            error: error.message,
            isLoading: false
          }));
        }
      } else if (event.data.type === 'spotify_auth_error') {
        console.error('❌ Auth error from popup:', event.data.error);
        update(state => ({
          ...state,
          error: event.data.error,
          isLoading: false
        }));
      }
    },
    
    // Logout
    logout: () => {
      console.log('👋 Logging out...');
      try {
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_refresh_token');
        sessionStorage.removeItem('spotify_auth_state');
        sessionStorage.removeItem('spotify_code_verifier');
        console.log('✅ Tokens cleared from storage');
      } catch (error) {
        console.error('❌ Error clearing storage:', error);
      }
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
