# LibSync Setup Guide

## Environment Variables

Create a `.env` file in the project root with the following:

```env
# Spotify API Configuration
PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback/spotify

# Deezer API Configuration
PUBLIC_DEEZER_APP_ID=your_deezer_app_id_here
PRIVATE_DEEZER_APP_SECRET=your_deezer_secret_key_here
PUBLIC_DEEZER_REDIRECT_URI=http://localhost:5173/callback/deezer
```

## Spotify Setup

1. **Create Spotify App**
   - Go to: https://developer.spotify.com/dashboard
   - Click "Create app"
   - Fill in:
     - App name: `LibSync Dev`
     - App description: `Music library transfer tool`
     - Redirect URI: `http://localhost:5173/callback/spotify`
     - API/SDK: Check "Web API"
   - Click "Save"

2. **Get Credentials**
   - Copy the **Client ID** from your app dashboard
   - Add it to `.env` as `PUBLIC_SPOTIFY_CLIENT_ID`

3. **Add Test Users (Important!)**
   - In your app dashboard, click **Settings**
   - Scroll to **User Management**
   - Click **Add New User**
   - Enter your Spotify email address
   - Click **Add**
   
   ⚠️ **Note:** Spotify apps in Development Mode can only be used by users added to this list. You can add up to 25 users.

## Deezer Setup

1. **Create Deezer App**
   - Go to: https://developers.deezer.com/myapps
   - Click "Create a new Application"
   - Fill in:
     - Application Name: `LibSync Dev`
     - Application Domain: `localhost`
     - Redirect URL: `http://localhost:5173/callback/deezer`
   - Accept terms and create

2. **Get Credentials**
   - Copy the **Application ID** 
   - Copy the **Secret Key**
   - Add both to `.env`:
     - `PUBLIC_DEEZER_APP_ID` = Application ID
     - `PRIVATE_DEEZER_APP_SECRET` = Secret Key (uses PRIVATE_ prefix for security)

## Testing the Implementation

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Test Spotify Authentication**
   - Click "Spotify Connection" button
   - Popup opens → login → authorize
   - Popup closes → user info displays on main page
   - You should see: name, email, profile picture

3. **Test Deezer Authentication**
   - Click "Deezer Connection" button
   - Popup opens → login → authorize
   - Popup closes → user info displays on main page
   - You should see: name, email, profile picture

## Troubleshooting

### Spotify 403 Error
**Problem:** "Failed to fetch user profile: 403"

**Solution:** Your Spotify account email isn't added to the app's User Management. Go to Spotify Dashboard → Your App → Settings → User Management → Add your email.

### Deezer Connection Fails
**Problem:** Token exchange fails

**Solution:** 
- Verify `PRIVATE_DEEZER_APP_SECRET` is correct in `.env`
- Check redirect URI matches exactly: `http://localhost:5173/callback/deezer`
- Ensure your Deezer app is active
- Restart dev server after changing `.env` file

### Popup Blocked
**Problem:** Login popup doesn't open

**Solution:** Allow popups for `localhost:5173` in your browser settings

### CORS Errors
**Problem:** Cross-origin errors in console

**Solution:** This shouldn't happen with the current setup. If it does:
- Clear browser cache
- Restart dev server
- Check redirect URIs are exact matches

## Next Steps After Authentication Works

Once both Spotify and Deezer connections work, here's the roadmap:

### Phase 1: Fetch User Data
- [ ] Get user's playlists from Spotify
- [ ] Get user's playlists from Deezer
- [ ] Display playlists in UI

### Phase 2: Playlist Details
- [ ] Fetch tracks for selected playlist
- [ ] Display track info (title, artist, album)
- [ ] Show track count and metadata

### Phase 3: Transfer Logic
- [ ] Search for tracks on destination platform
- [ ] Implement fuzzy matching (handle track name variations)
- [ ] Handle tracks not found on destination
- [ ] Create new playlist on destination

### Phase 4: Sync Features
- [ ] Bi-directional sync
- [ ] Incremental updates
- [ ] Conflict resolution

### Phase 5: Additional Platforms
- [ ] Apple Music integration
- [ ] YouTube Music integration
- [ ] Tidal integration

## API Documentation

### Spotify Web API
- Docs: https://developer.spotify.com/documentation/web-api
- Key endpoints:
  - `/v1/me` - Get current user profile
  - `/v1/me/playlists` - Get user playlists
  - `/v1/playlists/{id}/tracks` - Get playlist tracks
  - `/v1/playlists` - Create playlist
  - `/v1/playlists/{id}/tracks` - Add tracks to playlist

### Deezer API
- Docs: https://developers.deezer.com/api
- Key endpoints:
  - `/user/me` - Get current user
  - `/user/me/playlists` - Get user playlists
  - `/playlist/{id}` - Get playlist details
  - `/user/me/playlists` (POST) - Create playlist
  - `/playlist/{id}/tracks` (POST) - Add tracks to playlist

## File Structure

```
src/
├── lib/
│   ├── auth/
│   │   ├── spotify.ts          # Spotify OAuth flow
│   │   ├── deezer.ts           # Deezer OAuth flow
│   │   └── pkce.ts             # PKCE helper functions
│   ├── stores/
│   │   ├── spotifyAuth.ts      # Spotify state management
│   │   └── deezerAuth.ts       # Deezer state management
│   └── components/             # Reusable UI components
├── routes/
│   ├── +page.svelte           # Main landing page
│   ├── callback/
│   │   ├── spotify/
│   │   │   └── +page.svelte   # Spotify OAuth callback
│   │   └── deezer/
│   │       └── +page.svelte   # Deezer OAuth callback
│   └── api/
│       ├── spotify/
│       │   └── token/
│       │       └── +server.ts # Spotify token exchange
│       └── deezer/
│           └── token/
│               └── +server.ts # Deezer token exchange
```

## Security Notes

⚠️ **Important:**
- Never commit `.env` to git (already in `.gitignore`)
- `PRIVATE_DEEZER_APP_SECRET` must use `PRIVATE_` prefix (server-side only)
- In production, use proper secret management (e.g., Vercel env vars)
- Validate all redirect URIs match exactly
- Always restart dev server after changing `.env` file
- Use HTTPS in production

## Production Deployment

Before deploying:

1. **Update Redirect URIs:**
   ```env
   PUBLIC_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback/spotify
   PUBLIC_DEEZER_REDIRECT_URI=https://yourdomain.com/callback/deezer
   ```

2. **Add Production URIs to App Dashboards:**
   - Spotify Dashboard → Your App → Settings → Redirect URIs
   - Deezer Dashboard → Your App → Redirect URL

3. **Request Extended Quota (Spotify):**
   - For public use, request Extended Quota Mode
   - Fill out the form in Spotify Dashboard
   - Wait for approval (usually a few days)

4. **Environment Variables:**
   - Add all env vars to your hosting platform
   - Never expose secrets in client-side code

