<script lang="ts">
	import { goto } from '$app/navigation';
	import { getSavedAccessToken } from '$lib/actions/auth.actions';
	import { storageKeys } from '$lib/constants/storage.const';
	import { ONE_MINUTE_MS } from '$lib/constants/time.const';
	import { auth, pendingCallbackUrl } from '$lib/stores/auth.store';
	import { clearSpotifySdk, initializeSpotifySdk } from '$lib/stores/spotify.store';
	import '@fontsource/geist-mono/400.css';
	import '@fontsource/geist-mono/500.css';
	import '@fontsource/geist-mono/600.css';
	import '@fontsource/geist-mono/700.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';

	let loading = true; // Start as true to prevent flash
	let initialized = false;

	const handleDeepLink = (url: string) => {
		pendingCallbackUrl.set(url);
		goto('/auth/callback');
	};

	onMount(async () => {
		// Set up deep link handler first
		await onOpenUrl((urls) => handleDeepLink(urls[0]));

		const { accessToken, clientId } = getSavedAccessToken();

		if (!accessToken || !clientId) {
			loading = false;
			initialized = true;
			return;
		}

		try {
			// Initialize SDK with stored token - the auth strategy handles refresh automatically
			const sdk = initializeSpotifySdk(clientId, accessToken);

			// Validate the session by fetching the user profile
			const me = await sdk.currentUser.profile();

			if (!me) {
				throw new Error('Failed to get user profile');
			}

			$auth.isLoggedIn = true;
		} catch (error) {
			console.error('[Layout] Auth initialization failed:', error);
			// Clear everything on failure
			clearSpotifySdk();
			localStorage.removeItem(storageKeys.accessToken);
			$auth.isLoggedIn = false;
		} finally {
			loading = false;
			initialized = true;
		}
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: ONE_MINUTE_MS * 9,
				gcTime: ONE_MINUTE_MS * 10
			}
		}
	});

	// Only navigate after initialization to prevent race conditions
	$: if (initialized) {
		if ($auth.isLoggedIn) {
			goto('/main');
		} else {
			goto('/');
		}
	}
</script>

<QueryClientProvider client={queryClient}>
	<Toaster />

	{#if loading}
		<div class="flex items-center justify-center w-full min-h-screen bg-neo-black text-white">
			<div>Loading...</div>
		</div>
	{:else}
		<main class="bg-neo-black w-full min-h-screen text-white flex text-xs">
			<slot />
		</main>
	{/if}
</QueryClientProvider>
