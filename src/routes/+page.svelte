<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Accordion from "$lib/components/ui/accordion/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { slide } from 'svelte/transition';
    import * as ToggleGroup from "$lib/components/ui/toggle-group";
    import { Hourglass, Music, HeadphoneOff, Link, ListMusic, Upload, Check } from "lucide-svelte";
    import { openSpotifyAuth, openDeezerAuth } from '$lib/auth';
    import { spotifyAuth } from '$lib/stores';
    import spotifyIcon from '$lib/assets/icons/spotify_logo_with_name.svg';
    import deezerIcon from '$lib/assets/icons/deezer_logo_with_name.svg';
    import appleIcon from '$lib/assets/icons/applemusic_logo_with_name.svg';
    import { AuthButton } from '$lib';
    import { env } from '$env/dynamic/public';
    import { onMount, onDestroy } from 'svelte';


    let messageHandler: (event: MessageEvent) => void;
    
    onMount(() => {
        // Set up message listener for popup
        messageHandler = (event: MessageEvent) => {
        spotifyAuth.handleAuthMessage(event);
        };
        
        window.addEventListener('message', messageHandler);
    });
    
    onDestroy(() => {
        // Cleanup listener
        if (messageHandler) {
        window.removeEventListener('message', messageHandler);
        }
    });

    async function handleSpotifyLogin() {
        try {
        await openSpotifyAuth({
            clientId: env.PUBLIC_SPOTIFY_CLIENT_ID,
            redirectUri: env.PUBLIC_SPOTIFY_REDIRECT_URI,
            scopes: [
                'user-read-private',
                'user-read-email',
                'playlist-modify-public',
                'playlist-modify-private',
                'playlist-read-private',
                'user-library-modify',
                'user-library-read'
            ]
        });
        } catch (error) {
        console.error('Login failed:', error);
        }
    }
    // function handleSpotifyLogin() {
    //     openSpotifyAuth({
    //     clientId: env.PUBLIC_SPOTIFY_CLIENT_ID,
    //     redirectUri: 'http://localhost:5173/callback',
    //     scopes: [
    //             'user-read-private',
    //             'user-read-email',
    //             'playlist-modify-public',
    //             'playlist-modify-private',
    //             'playlist-read-private',
    //             'user-library-modify',
    //             'user-library-read'
    //         ]
    //     });
    // }
  
    function handleDeezerLogin() {
        openDeezerAuth({
        appId: 'YOUR_DEEZER_APP_ID',
        redirectUri: 'http://localhost:5173/callback',
        perms: ['basic_access', 'email']
        });
    }
    
    let billingPeriod: 'monthly' | 'yearly' = 'monthly';
    $: price = billingPeriod === 'monthly' ? 20 : 11.99;
   </script>
<header>
    <nav class="bg-primary p-6">
    <div class="container mx-auto flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-8">
            <a href="/" class="text-primary-foreground text-4xl font-bold transition-transform hover:scale-110">
                LIBSYNC
            </a>
            <!-- You can add your icon/symbol here -->
            <div class="text-primary-foreground text-xl">✴</div>
        </div>

        <!-- Navigation Links -->
        <div class="flex items-center space-x-8">
            <a href="#How-it-works" class="text-xl text-primary-foreground relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:bg-white hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300">Features</a>
            <a href="#Pricing" class="text-xl text-primary-foreground relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:bg-white hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300">Pricing</a>
            <a href="#faq" class="text-xl text-primary-foreground relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300">FAQ</a>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
        <a href="/login" class="text-xl text-primary-foreground  relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:bg-white hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300">Log in</a>
        <a href="/get-started" class="text-xl bg-orange-600 text-white px-4 py-2 rounded-lg hover:scale-95 hover:bg-orange-700 hover:text-white transition-transform">
        Get Started
        </a>
        </div>
    </div>
    </nav>
</header>

<!-- Hero Section -->
<section class="bg-primary py-24 pb-32">
    <div class="container mx-auto text-center">
        <h1 class="text-8xl font-bold mb-6 text-primary-foreground pb-10 uppercase">Quickly Move <br />
            Your Music Library Anywhere.</h1>
        <p class="text-2xl text-primary-foreground/70 mb-16 max-w-3xl mx-auto">
            Transfer your favorite tracks, albums, and playlists in just 3 steps. <br />
            Move & Sync from one streaming service to another.
        </p>
        <div class="flex justify-center gap-4">
            <Button variant="default" size="lg" class="text-lg bg-orange-600 hover:scale-95 hover:bg-orange-700">Get Started For Free</Button>
            <Button variant="outline" size="lg" class="text-lg hover:scale-95">Watch Demo</Button>
        </div>
    </div>
</section>

<section id="transfer-connect-source" class="bg-primary py-32">
    <div class="auth-container">
        <h1 class="text-2xl font-bold mb-6 text-primary-foreground pb-10 uppercase">Connect your source system</h1>
        <div class="auth-buttons">
            <AuthButton 
                icon={spotifyIcon} 
                label="Spotify Connection" 
                onClick={handleSpotifyLogin} 
            />
            <AuthButton 
                icon={deezerIcon} 
                label="Deezer Connection" 
                onClick={handleDeezerLogin} 
            />
            <AuthButton 
                icon={appleIcon} 
                label="Apple Music Connection" 
                onClick={handleSpotifyLogin} 
            />
        </div>
    </div>
</section>


<div class="container">
  
  {#if $spotifyAuth.isLoading}
    <p>Loading...</p>
  {/if}
  
  {#if $spotifyAuth.error}
    <div class="error">
      <p>Error: {$spotifyAuth.error}</p>
      <button on:click={spotifyAuth.clearError}>Dismiss</button>
    </div>
  {/if}
  
  {#if $spotifyAuth.isAuthenticated && $spotifyAuth.user}
    <div class="user-info">
      <p>Welcome, {$spotifyAuth.user.display_name}!</p>
      <p>Email: {$spotifyAuth.user.email}</p>
      <button on:click={spotifyAuth.logout}>Logout</button>
    </div>
  {:else}
    <button on:click={handleSpotifyLogin}>
      Login with Spotify
    </button>
  {/if}
</div>


<!-- Pain Points Section -->
<section class="bg-primary py-20">
    <div class="container mx-auto">
        <h2 class="text-gray-500 text-center pb-10">IS THAT YOU?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-gray-9 backdrop-blur-sm rounded-lg p-8 hover:scale-105 transition-transform flex flex-col items-center text-center">
                <div class="text-4xl mb-2">
                    <Music class="w-6 h-6 text-orange-600" />
                </div>
                <blockquote class="text-3xl text-primary-foreground italic">
                    "I've built the perfect playlist... but I can't take it with me!"
                </blockquote>
            </div>

            <div class="bg-gray-9 backdrop-blur-sm rounded-lg p-8 hover:scale-105 transition-transform flex flex-col items-center text-center">
                <div class="text-4xl mb-2">
                    <Hourglass class="w-6 h-6 text-orange-600" />
                </div>

                <blockquote class="text-3xl text-primary-foreground italic">
                    "Manually re-creating playlists takes forever."
                </blockquote>
            </div>

            <div class="bg-gray-9 backdrop-blur-sm rounded-lg p-8 hover:scale-105 transition-transform flex flex-col items-center text-center">
                <div class="text-4xl mb-2">
                    <HeadphoneOff class=" w-6 h-6 text-orange-600" />
                </div>
                <blockquote class="text-3xl text-primary-foreground italic">
                    "I don't want to lose my favorite songs!"
                </blockquote>
            </div>
        </div>
    </div>
</section>

<!-- How It Works Section -->
<section id="How-it-works" class="bg-primary py-32">
    <div class="container mx-auto">
        <h2 class="text-gray-500 text-center pb-10 uppercase">How It Works</h2>

        <!-- Timeline Steps -->
        <div class="max-w-5xl mx-auto relative">
            <!-- Vertical Timeline Line -->
            <div class="absolute left-[2.5rem] top-12 bottom-12 w-[1px] bg-white"></div>

            <!-- Step 1 -->
            <div class="flex items-center gap-12 mb-16 group relative">
                <div class="w-20 h-20 rounded-full bg-primary border-2 border-white flex items-center justify-center flex-shrink-0 z-10 group-hover:scale-110 transition-transform">
                    <span class="text-3xl font-bold text-white">1</span>
                    <!-- <Link class="w-12 h-12 text-white" /> -->
                </div>
                <div class="bg-gray-9 backdrop-blur-sm ml-8 p-8 flex-grow group-hover:scale-105 transition-transform">
                    <div class="flex items-center gap-4 mb-4">
                        <Link class="w-12 h-12 text-white" />
                        <h3 class="text-5xl font-bold text-primary-foreground">Connect Your Source Service</h3>
                    </div>
                    <p class="text-primary-foreground/60">
                        Simply connect your existing music service account. We support all major platforms including Spotify, Apple Music, and more.
                    </p>
                </div>
            </div>

            <!-- Step 2 -->
            <div class="flex items-center gap-12 mb-16 group">
                <div class="w-20 h-20 rounded-full bg-primary border-2 border-white flex items-center justify-center flex-shrink-0 z-10 group-hover:scale-110 transition-transform">
                    <span class="text-3xl font-bold text-white">2</span>
                </div>
                <div class="bg-gray-9 backdrop-blur-sm ml-8 p-8 flex-grow group-hover:scale-105 transition-transform">
                    <div class="flex items-center gap-4 mb-4">
                        <ListMusic class="w-12 h-12 text-white" />
                        <h3 class="text-5xl font-bold text-primary-foreground">Select Tracks & Playlists</h3>
                    </div>
                    <p class="text-primary-foreground/60">
                        Choose which songs, albums, or playlists you want to transfer. Our smart selection tool makes it easy to pick exactly what you need.
                    </p>
                </div>
            </div>

            <!-- Step 3 -->
            <div class="flex items-center gap-12 group">
                <div class="w-20 h-20 rounded-full bg-primary border-4 border-orange-600 flex items-center justify-center flex-shrink-0 z-10 group-hover:scale-110 transition-transform">
                    <span class="text-4xl font-bold text-orange-600">3</span>
                </div>
                <div class="bg-gray-9 backdrop-blur-sm ml-8 p-8 flex-grow group-hover:scale-105 transition-transform">
                    <div class="flex items-start gap-4">
                        <Upload class="w-12 h-12 text-white rounded-md p-1" />
                        <div>
                            <h3 class="text-5xl font-bold text-primary-foreground mb-4">Upload to New Service</h3>
                            <p class="text-primary-foreground/60">
                                We'll handle the transfer process automatically. Your music will be ready in your new service in minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Message -->
        <div class="mt-16 text-center">
            <div class="inline-flex items-center gap-2 text-primary-foreground/80">
                <Check class="w-6 h-6 text-green-500" />
                <span>That's it! You're ready to enjoy your music on your new platform.</span>
            </div>
        </div>
    </div>
</section>

<!-- Pricing section -->
<section id="Pricing" class="bg-primary py-32">
    <div class="container mx-auto">
        <p class="text-gray-500 text-center">PRICING</p>
        <h2 class="text-4xl font-bold text-center mb-16 text-primary-foreground">Choose Your Plan</h2>
        <!-- Pricing cards container -->
        <div class="flex justify-center gap-8">
            <!-- Free Plan Card --> 
            <Card.Root class="w-[600px] h-[700px] bg-gray-9 backdrop-blur-sm border border-primary-foreground/20 flex flex-col">
                <Card.Header class="space-y-4 p-10 flex items-center justify-center">
                    <Card.Title class="text-6xl font-bold text-primary-foreground">FREE</Card.Title>
                    <Card.Description class="text-xl text-primary-foreground/80">Easy to use. Simple to test. No credit card required.</Card.Description>
                    <div class="h-1"></div>

                </Card.Header>
                
                <Card.Content class="p-10 space-y-4 mt-auto">
                    <!-- Separator with text-->
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <span class="w-full border-t border-muted-foreground"></span>
                        </div>
                        <div class="relative flex justify-center text-xs uppercase">
                            <span class="bg-primary px-2 text-muted-foreground">Includes</span>
                        </div>
                    </div>
                    <ul class="space-y-3 text-primary-foreground/80">
                        <li>✓ Access to All streaming services</li>
                        <li>✓ 500 songs Synced accross platforms</li>
                        <li>✓ 1 Playlist sync accross platforms</li>
                        <li>✓ Priority support</li>
                    </ul>
                </Card.Content>
                <Card.Footer class="p-10 mt-auto">
                    <Button variant="default" size="lg" class="w-full bg-white text-black hover:bg-white/90">
                        Get Started
                    </Button>
                </Card.Footer>
            </Card.Root>

            <!-- First paid Plan Card -->
            <Card.Root class="w-[600px] h-[700px]  bg-orange-600 border border-primary-foreground/20 flex flex-col">
                <Card.Header class="space-y-4 p-10">
                    <div class="flex flex-col items-center gap-4">
                        <!-- Price Display -->
                        <div class="flex items-end gap-1">
                            <div class="flex flex-col items-center gap-4 h-14">
                                {#key price}
                                    <div in:slide>
                                        <Card.Title class="text-6xl font-bold text-white">
                                            ${price}
                                        </Card.Title>
                                    </div>
                                {/key}
                            </div>
                            <div class="text-sm italic text-white/90 mb-2">/ month</div>
                        </div>

                        <!-- Billing Toggle -->
                        <ToggleGroup.Root
                            type="single"
                            value={billingPeriod}
                            onValueChange={(value) => {
                                if (value === 'monthly' || value === 'yearly') {
                                    billingPeriod = value;
                                }
                            }}
                            class="bg-black/20 p-1 rounded-lg"
                        >
                            <ToggleGroup.Item value="monthly" class="px-4 py-2 rounded data-[state=on]:bg-white data-[state=on]:text-orange-600 text-white">
                                Monthly
                            </ToggleGroup.Item>
                            <ToggleGroup.Item value="yearly" class="px-4 py-2 rounded data-[state=on]:bg-white data-[state=on]:text-orange-600 text-white">
                                Yearly
                            </ToggleGroup.Item>
                        </ToggleGroup.Root>

                        <!-- Savings Text -->
                        <div class="text-white/90 text-sm">
                            {#if billingPeriod === 'monthly'}
                                Save 40% on yearly plan.
                            {:else}
                                You're saving $96 a year.
                            {/if}
                        </div>
                    </div>
                </Card.Header>
                
                <Card.Content class="p-10 space-y-4 mt-auto ">
                    <!-- Separator with text-->
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <span class="w-full border-t border-white/50"></span>
                        </div>
                        <div class="relative flex justify-center text-xs uppercase">
                            <span class="bg-orange-600 px-2 text-white/50">Includes</span>
                        </div>
                    </div>
                    <ul class="space-y-3 text-white/90">
                        <li>✓ Access all music streaming platforms</li>
                        <li>✓ Unlimited songs Synced accross platforms</li>
                        <li>✓ Unlimited Playlist sync accross platforms</li>
                        <li>✓ Local export of your music library (.csv, .xlsx, .json)</li>
                        <li>✓ Priority support</li>
                    </ul>
                </Card.Content>
                <Card.Footer class="p-10 mt-auto">
                    <Button variant="secondary" size="lg" class="w-full bg-white text-orange-600 hover:bg-white/90">
                        Become a Supporter
                    </Button>
                </Card.Footer>
            </Card.Root>
        </div>
    </div>
</section>

<!-- FAQ Section -->
<section id="faq" class="bg-primary pb-20 py-4">
    <div class="container mx-auto py-20 bg-primary">
    <h2 class="text-4xl font-bold text-center mb-16 text-primary-foreground">Frequently Asked Questions</h2>
    <Accordion.Root type="single">
        <Accordion.Item value="item-1" class="border-b border-primary-foreground/20 hover">
          <Accordion.Trigger class="text-2xl text-primary-foreground">Can I use LibSync for Free?</Accordion.Trigger>
          <Accordion.Content class="text-xl text-muted-foreground ">
            Yes. We have a dedicated free tier for you to try out the app.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2" class="border-b border-primary-foreground/20">
            <Accordion.Trigger class="text-2xl text-primary-foreground">Is it dangerous to let LibSync access my steraming account?</Accordion.Trigger>
            <Accordion.Content class="text-xl text-muted-foreground">
              No. We are open source to let you audit our code. We only use your data to provide you with the best experience. Feel free to audit our code.
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3" class="border-b border-primary-foreground/20">
            <Accordion.Trigger class="text-2xl text-primary-foreground">Can I use LibSync to export my music library from Spotify to Apple Music?</Accordion.Trigger>
            <Accordion.Content class="text-xl text-muted-foreground">
            Yes. We support exporting from Spotify to Apple Music. We also support exporting from Apple Music to Spotify. Check out our blog post for guideline.
            </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
</section>

<!-- Footer -->
<footer class="bg-primary text-primary-foreground py-12">
    <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 class="text-xl font-bold mb-4">LibSync</h3>
                <p class="text-primary-foreground/80">Share your music.</p>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Product</h4>
                <ul class="space-y-2">
                    <li><a href="#How-it-works" class="hover:underline">Features</a></li>
                    <li><a href="#Pricing" class="hover:underline">Pricing</a></li>
                    <li><a href="#faq" class="hover:underline">FAQ</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Company</h4>
                <ul class="space-y-2">
                    <li><a href="/about" class="hover:underline">About</a></li>
                    <li><a href="/blog" class="hover:underline">Blog</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Legal</h4>
                <ul class="space-y-2">
                    <li><a href="/privacy" class="hover:underline">Privacy Policy</a></li>
                    <li><a href="/terms" class="hover:underline">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60">
            <p>Made with ❤️ by <a href="https://github.com/lejcestlesang" class="hover:underline">J</a></p>
        </div>
    </div>
</footer>

<style>
  .auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* min-height: 100vh; */
  }
  
  .auth-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>