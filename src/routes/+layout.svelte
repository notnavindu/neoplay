<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		getSavedAccessToken,
		refreshAccessToken,
		saveSpotifyAccessTokenResponse
	} from '$lib/actions/auth.actions';
	import { storageKeys } from '$lib/constants/storage.const';
	import { ONE_MINUTE_MS } from '$lib/constants/time.const';
	import { auth, pendingCallbackUrl } from '$lib/stores/auth.store';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import '@fontsource/geist-mono/400.css';
	import '@fontsource/geist-mono/500.css';
	import '@fontsource/geist-mono/600.css';
	import '@fontsource/geist-mono/700.css';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';

	let loading = false;
	let log: string[] = [];

	const handleDeepLink = (url: string) => {
		pendingCallbackUrl.set(url);
		goto('/auth/callback');
	};

	onMount(async () => {
		await onOpenUrl((urls) => handleDeepLink(urls[0]));

		log = [...log, 'onMount'];
		const { accessToken, clientId } = getSavedAccessToken();
		log = [...log, 'got access token'];

		if (!accessToken || !clientId) return (loading = false);

		log = [...log, 'B'];

		refreshAccessToken(clientId, accessToken.refresh_token)
			.then(async (newToken) => {
				const sdk = SpotifyApi.withAccessToken(clientId, newToken);

				log = [...log, 'refreshed and got sdk'];

				const me = await sdk.currentUser.profile();

				log = [...log, 'got me'];

				if (!me) {
					log = [...log, 'no me'];

					localStorage.removeItem(storageKeys.accessToken);
					$auth.isLoggedIn = false;
					return (loading = false);
				}
				log = [...log, 'has me'];

				saveSpotifyAccessTokenResponse(newToken);
				log = [...log, 'D'];

				spotifySdk.set(sdk);
				log = [...log, 'E'];

				$auth.isLoggedIn = true;
				loading = false;
				log = [...log, 'F'];
			})
			.catch((e) => {
				log = [...log, 'error', JSON.stringify(e)];
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
			{#each log as item}
				<div>{item}</div>
			{/each}
		</div>
	{:else}
		<main class="bg-neo-black w-full min-h-screen text-white flex text-xs">
			<slot />
		</main>
	{/if}
</QueryClientProvider>
