<script lang="ts">
	import {
		getSavedAccessToken,
		refreshAccessToken,
		saveSpotifyAccessTokenResponse
	} from '$lib/actions/auth.actions';
	import { storageKeys } from '$lib/constants/storage.const';
	import { auth } from '$lib/stores/auth.store';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';
	import { onDestroy } from 'svelte';

	const loop = setInterval(
		async () => {
			const { accessToken, clientId } = getSavedAccessToken();
			if (!accessToken || !clientId) return console.log('Handle error');

			console.log('Saving token...');

			refreshAccessToken(clientId, accessToken.refresh_token).then(async (newToken) => {
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
		},
		1000 * 60 * 25
	);

	onDestroy(() => {
		clearInterval(loop);
	});
</script>
