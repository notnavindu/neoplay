<script lang="ts">
	import { saveSpotifyAccessTokenResponse } from '$lib/actions/auth.actions';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { onDestroy } from 'svelte';

	const loop = setInterval(
		async () => {
			console.log('Saving token...');
			const token = await $spotifySdk?.getAccessToken();
			if (token) saveSpotifyAccessTokenResponse(token as SpotifyAccessTokenResponse);
		},
		15 * 60 * 1000
	);

	onDestroy(() => {
		clearInterval(loop);
	});
</script>
