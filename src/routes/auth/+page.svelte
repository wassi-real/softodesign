<script lang="ts">
	import { signIn, signUp } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { supabase } from '$lib/supabase';
	import { toast } from '$lib/stores/toast';

	let isLogin = $state(true);
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');
	let redirectTo = $state('/dashboard');

	// Check if user is already logged in and handle redirect
	$effect(() => {
		if (browser) {
			// Check URL params for redirect
			const urlParams = new URLSearchParams(window.location.search);
			const redirect = urlParams.get('redirectTo');
			if (redirect) {
				redirectTo = redirect;
			}

			// Check Supabase session - if user is logged in, server will redirect
			// The server-side check in +page.server.ts will handle the redirect
			supabase.auth.getSession().then(({ data: { session } }) => {
				if (session) {
					// Ensure cookies are set
					fetch('/api/auth/session', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							access_token: session.access_token,
							refresh_token: session.refresh_token
						})
					}).then(() => {
						// Use hard redirect - server will verify and allow access
						window.location.href = redirectTo;
					});
				}
			});

			// Listen for auth state changes
			supabase.auth.onAuthStateChange((_event, session) => {
				if (session) {
					// Set cookies and redirect
					fetch('/api/auth/session', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							access_token: session.access_token,
							refresh_token: session.refresh_token
						})
					}).then(() => {
						window.location.href = redirectTo;
					});
				}
			});
		}
	});

	async function handleSubmit() {
		error = '';
		loading = true;

		if (!email || !password) {
			error = 'Please fill in all fields';
			toast.error('Please fill in all fields');
			loading = false;
			return;
		}

		if (!isLogin && password !== confirmPassword) {
			error = 'Passwords do not match';
			toast.error('Passwords do not match');
			loading = false;
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			toast.error('Password must be at least 6 characters');
			loading = false;
			return;
		}

		try {
			if (isLogin) {
				const { data, error: signInError } = await signIn(email, password);
				if (signInError) {
					error = signInError.message;
					toast.error(signInError.message);
				} else if (data.session) {
					toast.success('Signed in successfully!');
					// Store session tokens in cookies via API
					const response = await fetch('/api/auth/session', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							access_token: data.session.access_token,
							refresh_token: data.session.refresh_token
						})
					});
					
					if (response.ok) {
						// Use window.location for a hard redirect to ensure server-side checks run
						setTimeout(() => {
							window.location.href = redirectTo;
						}, 500);
					} else {
						error = 'Failed to save session';
						toast.error('Failed to save session');
					}
				}
			} else {
				const { data: signUpData, error: signUpError } = await signUp(email, password);
				if (signUpError) {
					error = signUpError.message;
					toast.error(signUpError.message);
				} else {
					toast.success('Account created! Please check your email to confirm.');
					// Redirect to confirmation page
					setTimeout(() => {
						goto(`/auth/confirm?email=${encodeURIComponent(email)}`);
					}, 1000);
				}
			}
		} catch (err) {
			error = 'An unexpected error occurred';
			toast.error('An unexpected error occurred');
		} finally {
			loading = false;
		}
	}

	function toggleMode() {
		isLogin = !isLogin;
		error = '';
		email = '';
		password = '';
		confirmPassword = '';
	}
</script>

<div class="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center px-4 overflow-hidden">
	<!-- Animated Grid Background -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="w-full h-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.15] animate-pulse"></div>
	</div>

	<div class="relative w-full max-w-xs sm:max-w-sm z-10 animate-scale-in">
		<!-- Logo -->
		<div class="mb-6 sm:mb-8 flex justify-center">
			<div class="relative transition-transform duration-300 hover:scale-110 hover:rotate-6">
				<img src="/logo.png" alt="SoftoDesign logo" class="h-12 w-auto sm:h-14 drop-shadow-lg" />
			</div>
		</div>

		<!-- Auth Card -->
		<div class="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
			<h1 class="text-2xl sm:text-3xl font-bold text-black mb-2 text-center">
				{isLogin ? 'Sign In' : 'Sign Up'}
			</h1>
			<p class="text-black/60 text-sm sm:text-base text-center mb-6">
				{isLogin ? 'Welcome back to SoftoDesign' : 'Create your SoftoDesign account'}
			</p>

			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-3.5">
				<!-- Email -->
				<div>
					<label for="email" class="block text-xs font-medium text-black mb-1.5">
						Email
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						class="w-full px-4 py-3 text-sm bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500 text-black placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
						placeholder="you@example.com"
					/>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="block text-xs font-medium text-black mb-1.5">
						Password
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						required
						class="w-full px-4 py-3 text-sm bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500 text-black placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
						placeholder="••••••••"
					/>
				</div>

				<!-- Confirm Password (Sign Up only) -->
				{#if !isLogin}
					<div>
						<label for="confirmPassword" class="block text-xs font-medium text-black mb-1.5">
							Confirm Password
						</label>
						<input
							type="password"
							id="confirmPassword"
							bind:value={confirmPassword}
							required
							class="w-full px-4 py-3 text-sm bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500 text-black placeholder-gray-400 transition-all duration-200 hover:border-gray-300"
							placeholder="••••••••"
						/>
					</div>
				{/if}

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={loading}
					class="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none"
				>
					{#if loading}
						<span class="flex items-center justify-center gap-2">
							<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Please wait...
						</span>
					{:else}
						{isLogin ? 'Sign In' : 'Sign Up'}
					{/if}
				</button>
			</form>

			<!-- Toggle Mode -->
			<div class="mt-6 text-center">
				<button
					type="button"
					onclick={toggleMode}
					class="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors duration-200"
				>
					{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
				</button>
			</div>
		</div>

		<!-- Back to Home -->
		<div class="mt-6 text-center">
			<a href="/" class="text-black/60 hover:text-black text-sm transition-colors duration-200 inline-flex items-center gap-1">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Back to home
			</a>
		</div>
	</div>
</div>
