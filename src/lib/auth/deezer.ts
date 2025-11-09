export interface DeezerAuthConfig {
  appId: string;
  redirectUri: string;
  perms: string[];
}

export function openDeezerAuth(config: DeezerAuthConfig): void {
  const { appId, redirectUri, perms } = config;
  
  const authUrl = new URL('https://connect.deezer.com/oauth/auth.php');
  authUrl.searchParams.append('app_id', appId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('perms', perms.join(','));
  authUrl.searchParams.append('response_type', 'token');
  
  // Open popup window
  window.open(
    authUrl.toString(),
    'Deezer Authorization',
    'width=600,height=800,left=200,top=100'
  );
}