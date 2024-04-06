<script lang="ts">
	import { saveSpotifyAccessTokenResponse } from '$lib/actions/auth.actions';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { onDestroy } from 'svelte';

	const loop = setInterval(
		async () => {
			console.log('Saving token...');
			const token = await $spotifySdk?.getAccessToken();
			console.log('🚀 ~ token:', token);
			if (token) saveSpotifyAccessTokenResponse(token as SpotifyAccessTokenResponse);
		},
		1000 * 60 * 15
	);

	onDestroy(() => {
		clearInterval(loop);
	});
</script>
