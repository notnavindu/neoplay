<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		getSavedAccessToken,
		refreshAccessToken,
		saveSpotifyAccessTokenResponse
	} from '$lib/actions/auth.actions';
	import { storageKeys } from '$lib/constants/storage.const';
	import { ONE_MINUTE_MS } from '$lib/constants/time.const';
	import { auth } from '$lib/stores/auth.store';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import '@fontsource/geist-mono/400.css';
	import '@fontsource/geist-mono/500.css';
	import '@fontsource/geist-mono/600.css';
	import '@fontsource/geist-mono/700.css';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';

	let loading = true;

	onMount(() => {
		const { accessToken, clientId } = getSavedAccessToken();
		if (!accessToken || !clientId) return (loading = false);

		refreshAccessToken(clientId, accessToken.refresh_token).then(async (newToken) => {
			const sdk = SpotifyApi.withAccessToken(clientId, newToken);

			const me = await sdk.currentUser.profile();

			if (!me) {
				localStorage.removeItem(storageKeys.accessToken);
				$auth.isLoggedIn = false;
				return (loading = false);
			}

			saveSpotifyAccessTokenResponse(newToken);
			spotifySdk.set(sdk);
			$auth.isLoggedIn = true;
			loading = false;
		});
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: ONE_MINUTE_MS * 9,
				gcTime: ONE_MINUTE_MS * 10
			}
		}
	});

	$: {
		if ($auth.isLoggedIn) goto('/main');
		else goto('/');
	}
</script>

<QueryClientProvider client={queryClient}>
	<Toaster />

	{#if loading}
		<div>
			<div>Loading</div>
		</div>
	{:else}
		<main class="bg-neo-black w-full min-h-screen text-white flex text-xs">
			<slot />
		</main>
	{/if}
</QueryClientProvider>
