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
	import toast from 'svelte-french-toast';

	const loop = setInterval(
		async () => {
			const { accessToken, clientId } = getSavedAccessToken();
			if (!accessToken || !clientId) {
				toast.error("Couldn't refresh token. Please log in again.", {
					duration: 5000
				});
				localStorage.clear();
				return;
			}

			console.log('Saving token...');

			refreshAccessToken(clientId, accessToken.refresh_token).then(async (newToken) => {
				const sdk = SpotifyApi.withAccessToken(clientId, newToken);

				const me = await sdk.currentUser.profile();

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
