import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_REDIRECT_URI } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
  console.log('🔄 Token exchange endpoint called');
  
  try {
    const { code, codeVerifier } = await request.json();
    
    console.log('📝 Code received:', code?.substring(0, 20) + '...');
    console.log('📝 Code verifier received:', codeVerifier?.substring(0, 20) + '...');
    
    if (!code || !codeVerifier) {
      console.error('❌ Missing code or codeVerifier');
      throw error(400, 'Missing code or codeVerifier');
    }
    
    const clientId = PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = PUBLIC_SPOTIFY_REDIRECT_URI;
    
    console.log('📝 Client ID:', clientId?.substring(0, 10) + '...');
    console.log('📝 Redirect URI:', redirectUri);
    
    if (!clientId) {
      console.error('❌ Missing Spotify Client ID');
      throw error(500, 'Server configuration error: Missing client ID');
    }
    
    if (!redirectUri) {
      console.error('❌ Missing Spotify Redirect URI');
      throw error(500, 'Server configuration error: Missing redirect URI');
    }
    
    // Exchange authorization code for access token using PKCE
    console.log('🔄 Calling Spotify token endpoint...');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });
    
    console.log('📡 Spotify token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Spotify token exchange failed:', tokenResponse.status, errorText);
      
      let errorMessage = 'Token exchange failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error_description || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText;
      }
      
      throw error(tokenResponse.status, errorMessage);
    }
    
    const tokenData = await tokenResponse.json();
    console.log('✅ Token exchange successful');
    console.log('📝 Access token received:', tokenData.access_token?.substring(0, 20) + '...');
    
    // NOW: Fetch user profile from Spotify to get email
    console.log('🔄 Fetching user profile from Spotify...');
    const profileResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    if (!profileResponse.ok) {
      const errorBody = await profileResponse.text();
      console.error('❌ Failed to fetch user profile:', profileResponse.status);
      console.error('❌ Spotify error response:', errorBody);
      console.error('❌ This usually means:');
      console.error('   1. Your Spotify app is in Development Mode');
      console.error('   2. The user email is not added to the allowlist in Spotify Dashboard');
      console.error('   3. Go to https://developer.spotify.com/dashboard');
      console.error('   4. Select your app → Settings → Add the user email to "Users and Access"');
      throw error(profileResponse.status, `Failed to fetch user profile: ${errorBody}`);
    }
    
    const userProfile = await profileResponse.json();
    console.log('✅ User profile fetched');
    console.log('📧 User email:', userProfile.email);
    console.log('👤 User name:', userProfile.display_name);
    
    // Return tokens AND user profile
    return json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        display_name: userProfile.display_name,
        images: userProfile.images,
        country: userProfile.country,
        product: userProfile.product // premium, free, etc.
      }
    });
    
  } catch (err: any) {
    console.error('❌ Error in token exchange:', err);
    
    // If it's already a SvelteKit error, rethrow it
    if (err.status) {
      throw err;
    }
    
    // Otherwise create a new error
    throw error(500, err.message || 'Token exchange failed');
  }
};
