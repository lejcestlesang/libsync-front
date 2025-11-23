import { writable } from 'svelte/store';

interface DeezerUser {
  id: number;
  name: string;
  email: string;
  picture?: string;
  picture_small?: string;
  picture_medium?: string;
  picture_big?: string;
  country?: string;
}

interface DeezerAuthState {
  user: DeezerUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: DeezerAuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

function createDeezerAuthStore() {
  const { subscribe, set, update } = writable<DeezerAuthState>(initialState);

  // Try to restore from localStorage on init
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const savedToken = localStorage.getItem('deezer_token');
    
    if (savedToken) {
      console.log('🔄 Restoring saved Deezer token from localStorage');
      update(state => ({
        ...state,
        accessToken: savedToken,
        isAuthenticated: true
      }));
    }
  }

  return {
    subscribe,
    
    // Fetch user profile
    fetchUserProfile: async (accessToken: string) => {
      console.log('📡 Fetching Deezer user profile...');
      update(state => ({ ...state, isLoading: true, error: null }));
      
      try {
        const response = await fetch(`https://api.deezer.com/user/me?access_token=${accessToken}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Failed to fetch Deezer user profile:', response.status, errorText);
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }
        
        const user = await response.json();
        console.log('✅ Deezer user profile fetched successfully:', user.name);
        
        update(state => ({
          ...state,
          user,
          isAuthenticated: true,
          isLoading: false
        }));
        
        return user;
      } catch (error: any) {
        console.error('❌ Error fetching Deezer user profile:', error);
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
      console.log('📨 Received Deezer message:', event.data);
      
      // Verify origin
      if (event.origin !== window.location.origin) {
        console.warn('⚠️ Message from untrusted origin, ignoring:', event.origin);
        return;
      }
      
      if (event.data.type === 'deezer_auth_success') {
        const { code } = event.data;
        console.log('✅ Deezer auth success message received');
        console.log('📝 Code:', code?.substring(0, 20) + '...');
        
        update(state => ({ ...state, isLoading: true, error: null }));
        
        try {
          console.log('🔄 Exchanging code for Deezer tokens...');
          
          // Exchange code for token via SvelteKit API route
          const response = await fetch('/api/deezer/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          
          console.log('📡 Deezer token exchange response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Deezer token exchange failed:', response.status, errorData);
            throw new Error(`Token exchange failed: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('✅ Deezer token exchange successful');
          console.log('📝 Access token received:', data.access_token?.substring(0, 20) + '...');
          console.log('👤 User data received:', data.user?.name);
          console.log('📧 User email:', data.user?.email);
          
          // Store token in localStorage
          try {
            localStorage.setItem('deezer_token', data.access_token);
            console.log('✅ Deezer access token saved to localStorage');
          } catch (storageError) {
            console.error('❌ Failed to save to localStorage:', storageError);
          }
          
          // Update store with token AND user data
          update(state => ({
            ...state,
            accessToken: data.access_token,
            user: data.user,
            isAuthenticated: true,
            isLoading: false
          }));
          
          console.log('✅ Deezer store updated with token and user data');
          
        } catch (error: any) {
          console.error('❌ Error in Deezer handleAuthMessage:', error);
          update(state => ({
            ...state,
            error: error.message,
            isLoading: false
          }));
        }
      } else if (event.data.type === 'deezer_auth_error') {
        console.error('❌ Deezer auth error from popup:', event.data.error);
        update(state => ({
          ...state,
          error: event.data.error,
          isLoading: false
        }));
      }
    },
    
    // Logout
    logout: () => {
      console.log('👋 Logging out from Deezer...');
      try {
        localStorage.removeItem('deezer_token');
        console.log('✅ Deezer token cleared from storage');
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

export const deezerAuth = createDeezerAuthStore();

