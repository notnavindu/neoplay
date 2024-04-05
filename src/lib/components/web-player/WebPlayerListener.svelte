<script lang="ts">
	import {
		spotifyPlaybackState,
		spotifyPlayer,
		spotifyPlayerReady,
		spotifySdk
	} from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import { onDestroy, onMount } from 'svelte';

	onMount(() => {
		console.log('ON MOUND');
		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new Spotify.Player({
				getOAuthToken: async (cb) => {
					const token = await $spotifySdk?.getAccessToken();
					cb(token?.access_token as string);
				},
				name: 'Neoplay',
				volume: 0.5
			});

			spotifyPlayer.set(player);

			// TODO: Handle other events
			player.addListener('ready', ({ device_id }) => {
				console.log('Ready: ', device_id);
				$spotifyPlayerReady = true;
			});

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Not Ready: ', device_id);
				$spotifyPlayerReady = true;
			});

			player.addListener('player_state_changed', (state) => {
				console.log('🚀 ~ player.addListener ~ state:s', state);
				if (!state) return;

				currentTrack.set(state.track_window.current_track);

				player.getCurrentState().then((state) => {
					console.log('🚀 ~ player.getCurrentState ~ state:', state?.paused);
					spotifyPlaybackState.set(state);
				}); //
			});

			player.addListener('playback_error', (err) => {
				console.log(err);
			});

			player.addListener('account_error', (err) => {
				console.log(err);
			});

			player.addListener('authentication_error', (err) => {
				console.log(err);
			});

			player.addListener('initialization_error', (err) => {
				console.log(err);
			});

			player.connect();
		};
	});

	onDestroy(() => {
		$spotifyPlayer?.disconnect();
		// @ts-ignore
		delete window.onSpotifyWebPlaybackSDKReady;

		// TODO: Clear other listeners
	});
</script>

<svelte:head>
	<script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>
