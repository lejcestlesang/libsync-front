<script lang="ts">
  import { onMount } from 'svelte';
  
  let status = 'Processing...';
  
  onMount(async () => {
    console.log('🔄 Callback page loaded');
    
    try {
      // Get authorization code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      
      if (!code) {
        throw new Error('No authorization code received');
      }
      
      // Check if we're in a popup window
      if (window.opener && !window.opener.closed) {
        console.log('✅ Parent window detected, sending message...');
        
        // Send message to parent window
        window.opener.postMessage({
          type: 'spotify_auth_success',
          code: code,
          returnedState: state
        }, window.location.origin);
        
        console.log('✅ Message sent to parent window');
        status = 'Authentication successful! Closing...';
        setTimeout(() => {
          console.log('🔒 Closing popup window');
          window.close();
        }, 1000);
      } else {
        console.warn('⚠️ No parent window found or parent is closed');
        status = 'Please close this window and try again from the main page';
      }
      
    } catch (error: any) {
      console.error('❌ Auth error:', error);
      status = `Error: ${error.message}`;
      
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: 'spotify_auth_error',
          error: error.message
        }, window.location.origin);
        setTimeout(() => window.close(), 2000);
      }
    }
  });
</script>

<div class="loading">
  <h2>Spotify Authentication</h2>
  <p>{status}</p>
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  h2 {
    color: #1db954;
  }
</style>
