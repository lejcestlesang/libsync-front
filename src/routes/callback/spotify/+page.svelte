<!-- src/routes/callback/spotify/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let status = 'Processing...';
  
  onMount(async () => {
    try {
      // Get authorization code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      
      // Verify state
      const storedState = sessionStorage.getItem('spotify_auth_state');
      if (state !== storedState) {
        throw new Error('State mismatch - possible CSRF attack');
      }
      
      if (!code) {
        throw new Error('No authorization code received');
      }
      
      // Get stored code verifier
      const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }
      
      // If in popup, send code to parent
      if (window.opener) {
        window.opener.postMessage({
          type: 'spotify_auth_success',
          code,
          codeVerifier
        }, window.location.origin);
        
        status = 'Authentication successful! Closing...';
        setTimeout(() => window.close(), 1000);
      } else {
        // If not popup, exchange token directly and redirect
        await exchangeToken(code, codeVerifier);
        goto('/dashboard');
      }
      
    } catch (error) {
      console.error('Auth error:', error);
      status = `Error: ${error.message}`;
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'spotify_auth_error',
          error: error.message
        }, window.location.origin);
        setTimeout(() => window.close(), 2000);
      }
    }
  });
  
  async function exchangeToken(code: string, codeVerifier: string) {
    // This would call your backend API route
    const response = await fetch('/api/spotify/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, codeVerifier })
    });
    
    if (!response.ok) {
      throw new Error('Token exchange failed');
    }
    
    const data = await response.json();
    localStorage.setItem('spotify_token', data.access_token);
    localStorage.setItem('spotify_refresh_token', data.refresh_token);
  }
</script>

<div class="loading">
  <p>{status}</p>
</div>

<style>
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
  }
</style>
