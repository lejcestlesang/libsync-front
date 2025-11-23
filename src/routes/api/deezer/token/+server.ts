import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_DEEZER_APP_ID, PUBLIC_DEEZER_REDIRECT_URI } from '$env/static/public';
import { PRIVATE_DEEZER_APP_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  console.log('🔄 Deezer token exchange endpoint called');
  
  try {
    const { code } = await request.json();
    
    console.log('📝 Code received:', code?.substring(0, 20) + '...');
    
    if (!code) {
      console.error('❌ Missing code');
      throw error(400, 'Missing code');
    }
    
    const appId = PUBLIC_DEEZER_APP_ID;
    const secret = PRIVATE_DEEZER_APP_SECRET;
    const redirectUri = PUBLIC_DEEZER_REDIRECT_URI;
    
    console.log('📝 App ID:', appId?.substring(0, 10) + '...');
    console.log('📝 Redirect URI:', redirectUri);
    
    if (!appId || !secret) {
      console.error('❌ Missing Deezer credentials');
      throw error(500, 'Server configuration error: Missing Deezer credentials');
    }
    
    if (!redirectUri) {
      console.error('❌ Missing Deezer Redirect URI');
      throw error(500, 'Server configuration error: Missing redirect URI');
    }
    
    // Exchange authorization code for access token
    console.log('🔄 Calling Deezer token endpoint...');
    const tokenUrl = new URL('https://connect.deezer.com/oauth/access_token.php');
    tokenUrl.searchParams.append('app_id', appId);
    tokenUrl.searchParams.append('secret', secret);
    tokenUrl.searchParams.append('code', code);
    tokenUrl.searchParams.append('output', 'json');
    
    const tokenResponse = await fetch(tokenUrl.toString());
    
    console.log('📡 Deezer token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Deezer token exchange failed:', tokenResponse.status, errorText);
      throw error(tokenResponse.status, `Token exchange failed: ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log('✅ Token exchange successful');
    console.log('📝 Access token received:', tokenData.access_token?.substring(0, 20) + '...');
    
    // Fetch user profile from Deezer
    console.log('🔄 Fetching user profile from Deezer...');
    const profileResponse = await fetch(`https://api.deezer.com/user/me?access_token=${tokenData.access_token}`);
    
    if (!profileResponse.ok) {
      const errorBody = await profileResponse.text();
      console.error('❌ Failed to fetch user profile:', profileResponse.status);
      console.error('❌ Deezer error response:', errorBody);
      throw error(profileResponse.status, `Failed to fetch user profile: ${errorBody}`);
    }
    
    const userProfile = await profileResponse.json();
    console.log('✅ User profile fetched');
    console.log('📧 User email:', userProfile.email);
    console.log('👤 User name:', userProfile.name);
    
    // Return token AND user profile
    return json({
      access_token: tokenData.access_token,
      expires: tokenData.expires, // Deezer tokens expire
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        picture: userProfile.picture,
        picture_small: userProfile.picture_small,
        picture_medium: userProfile.picture_medium,
        picture_big: userProfile.picture_big,
        country: userProfile.country
      }
    });
    
  } catch (err: any) {
    console.error('❌ Error in Deezer token exchange:', err);
    
    if (err.status) {
      throw err;
    }
    
    throw error(500, err.message || 'Token exchange failed');
  }
};

