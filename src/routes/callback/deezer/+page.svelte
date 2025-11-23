<script lang="ts">
  import { onMount } from 'svelte';
  
  let status = 'Processing...';
  
  onMount(async () => {
    console.log('🔄 Deezer callback page loaded');
    
    try {
      // Deezer returns code in URL fragment OR query string
      const params = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.substring(1));
      
      const code = params.get('code') || hash.get('code');
      const error = params.get('error_reason') || hash.get('error_reason');
      
      if (error) {
        throw new Error(`Deezer auth error: ${error}`);
      }
      
      if (!code) {
        throw new Error('No authorization code received from Deezer');
      }
      
      // Check if we're in a popup window
      if (window.opener && !window.opener.closed) {
        console.log('✅ Parent window detected, sending message...');
        
        // Send message to parent window
        window.opener.postMessage({
          type: 'deezer_auth_success',
          code: code
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
      console.error('❌ Deezer auth error:', error);
      status = `Error: ${error.message}`;
      
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: 'deezer_auth_error',
          error: error.message
        }, window.location.origin);
        setTimeout(() => window.close(), 2000);
      }
    }
  });
</script>

<div class="loading">
  <h2>Deezer Authentication</h2>
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
    color: #FF0092;
  }
</style>

