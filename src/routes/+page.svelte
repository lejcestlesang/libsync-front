<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Accordion from "$lib/components/ui/accordion/index.js";

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
            <a href="/updates" class="text-xl text-primary-foreground relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:bg-white hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300">Features</a>
            <a href="/updates" class="text-xl text-primary-foreground relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:bg-white hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300">Pricing</a>
        <a href="/faq" class="text-xl text-primary-foreground relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white hover:after:w-full after:transition-all after:duration-300">FAQ</a>
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
        <h1 class="text-6xl font-bold mb-6 text-primary-foreground pb-10">Quickly Sync <br />
            Your Music Library Anywhere.</h1>
        <p class="text-xl text-primary-foreground mb-8 max-w-2xl mx-auto">
            Export, Move & Sync your music Library from one streaming service to another.
        </p>
        <div class="flex justify-center gap-4">
            <Button variant="default" size="lg" class="text-lg bg-orange-600 hover:scale-95 hover:bg-orange-700">Get Started Free</Button>
            <Button variant="outline" size="lg" class="text-lg">Watch Demo</Button>
        </div>
    </div>
</section>

<!-- FAQ Section -->
<section class="bg-primary pb-20">
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
                <p class="text-primary-foreground/80">Your music companion, everywhere you go.</p>
            </div>
            <div>
                <h4 class="font-semibold mb-4">Product</h4>
                <ul class="space-y-2">
                    <li><a href="/features" class="hover:underline">Features</a></li>
                    <li><a href="/pricing" class="hover:underline">Pricing</a></li>
                    <li><a href="/faq" class="hover:underline">FAQ</a></li>
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