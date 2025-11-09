import { generateCodeVerifier, generateCodeChallenge, generateRandomString } from './pkce';

export interface SpotifyAuthConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

export async function openSpotifyAuth(config: SpotifyAuthConfig): Promise<void>  {
  const { clientId, redirectUri, scopes } = config;
  

    // Generate PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);
  
  // Store verifier and state for later use
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);
  sessionStorage.setItem('spotify_auth_state', state);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes.join(' '));
  
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('code_challenge', codeChallenge);
  
  // // Open popup window
  // window.open(
  //   authUrl.toString(),
  //   'Spotify Authorization',
  //   'width=600,height=800,left=200,top=100'
  // );

  // Open popup
  const popup = window.open(
    authUrl.toString(),
    'Spotify Login',
    'width=600,height=800,left=200,top=100'
  );
  
  if (!popup) {
    throw new Error('Popup blocked');
  }
}