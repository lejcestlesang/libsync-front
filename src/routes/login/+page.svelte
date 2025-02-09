<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<div class="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
    <!-- Left container of the page -->
    <div class="min-h-screen">

        <!-- Logo Section -->
		<div class="absolute left-8 top-8 flex items-center space-x-8">
            <a href="/" class="text-black text-4xl font-bold transition-transform hover:scale-110">
                LIBSYNC
            </a>
            <!-- You can add your icon/symbol here -->
            <div class="text-black text-xl">✴</div>
        </div>

        <!-- Signup Form -->
		<div class="flex items-center justify-center min-h-screen py-12">
            <div class="mx-auto grid w-[350px] gap-6">
                
                <!-- Header -->
                <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-bold">Login</h1>
                    <p class="text-balance text-muted-foreground">
                        Enter your email below to login to your account.
                    </p>
                </div>

                <!-- Form Elements -->
                <form method="post" class="grid gap-4">
                    <!-- Email Input -->
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input name="email" id="email" type="email" placeholder="m@example.com" required />
                    </div>

                    <!-- Password Input -->
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <a href="##" class="ml-auto inline-block text-sm underline"> Forgot your password? </a>
                        </div>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    <!-- Buttons -->
                    <Button type="submit" class="w-full">Login</Button>
                </form>

                <!-- Sign Up Link -->
                <div class="mt-4 text-center text-sm">
                        Don&apos;t have an account?
                    <a href="/signup" class="underline"> Sign up </a>
                </div>
            </div>
        </div>
	</div>

    <!-- Right container of the page: Image Section -->
	<div class="hidden lg:flex lg:h-screen">
		<img
			src="/dj.jpg"
			alt="placeholder"
			width="1920"
			height="1080"
			class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>