<script lang="ts">
	import { goto } from '$app/navigation';
	import { refreshAccessToken, saveSpotifyAccessTokenResponse } from '$lib/actions/auth.actions';
	import { storageKeys } from '$lib/constants/storage.const';
	import { auth } from '$lib/stores/auth.store';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import '@fontsource/geist-mono/400.css';
	import '@fontsource/geist-mono/500.css';
	import '@fontsource/geist-mono/600.css';
	import '@fontsource/geist-mono/700.css';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		const accessTokenRaw = localStorage.getItem(storageKeys.accessToken) as string;
		const clientId = localStorage.getItem(storageKeys.clientId) as string;

		if (!accessTokenRaw || !clientId) return;

		const accessTokenParsed = JSON.parse(accessTokenRaw) as SpotifyAccessTokenResponse;

		if (!accessTokenParsed) return;

		refreshAccessToken(clientId, accessTokenParsed.refresh_token).then(async (newToken) => {
			console.log('NEWW', newToken);
			const sdk = SpotifyApi.withAccessToken(clientId, newToken);

			const me = await sdk.currentUser.profile();
			console.log('🚀 ~ refreshAccessToken ~ me2:', me);

			if (!me) {
				localStorage.removeItem(storageKeys.accessToken);
				$auth.isLoggedIn = false;
				return;
			}

			saveSpotifyAccessTokenResponse(newToken);
			spotifySdk.set(sdk);
			$auth.isLoggedIn = true;
		});
	});

	const queryClient = new QueryClient();

	$: {
		if ($auth.isLoggedIn) goto('/main');
		else goto('/');
	}
</script>

<QueryClientProvider client={queryClient}>
	<main class="bg-neo-black w-full min-h-screen text-white flex text-xs">
		<slot />
	</main>
</QueryClientProvider>
