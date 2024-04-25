<script lang="ts">
	import {
		spotifyDeviceId,
		spotifyPlaybackState,
		spotifyPlayer,
		spotifyPlayerReady,
		spotifySdk
	} from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import { onDestroy, onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	let preventDupes = false;

	const onPlayerReady: Spotify.PlaybackInstanceListener = ({ device_id }) => {
		$spotifyPlayerReady = true;
		$spotifyDeviceId = device_id;
	};

	const onPlayerNotReady: Spotify.PlaybackInstanceListener = ({ device_id }) => {
		$spotifyPlayerReady = false;
	};

	const onPlayerStateChanged: Spotify.PlaybackStateListener = (state) => {
		if (!state) return;

		if ($currentTrack?.id !== state?.track_window?.current_track.id) {
			currentTrack.set(state?.track_window?.current_track ?? null);
		}

		spotifyPlaybackState.set(state);
	};

	const onPlayerError: Spotify.ErrorListener = (err) => {
		toast.error(err.message);
	};

	onMount(async () => {
		if ($spotifyPlayer || preventDupes) return;
		window.onSpotifyWebPlaybackSDKReady = () => {
			preventDupes = true;
			const player = new Spotify.Player({
				getOAuthToken: async (cb) => {
					const token = await $spotifySdk?.getAccessToken();
					cb(token?.access_token as string);
				},
				name: 'Neoplay',
				volume: 0.5
			});

			player.addListener('ready', onPlayerReady);
			player.addListener('not_ready', onPlayerNotReady);
			player.addListener('player_state_changed', onPlayerStateChanged);
			player.addListener('playback_error', onPlayerError);
			player.addListener('account_error', onPlayerError);
			player.addListener('authentication_error', onPlayerError);
			player.addListener('initialization_error', onPlayerError);

			player.connect();

			spotifyPlayer.set(player);
		};
	});

	onDestroy(() => {
		$spotifyPlayer?.removeListener('ready', onPlayerReady);
		$spotifyPlayer?.removeListener('not_ready', onPlayerNotReady);
		$spotifyPlayer?.removeListener('player_state_changed', onPlayerStateChanged);
		$spotifyPlayer?.removeListener('playback_error', onPlayerError);
		$spotifyPlayer?.removeListener('account_error', onPlayerError);
		$spotifyPlayer?.removeListener('authentication_error', onPlayerError);
		$spotifyPlayer?.removeListener('initialization_error', onPlayerError);
		$spotifyPlayer?.disconnect();
	});
</script>

<svelte:head>
	<script src="https://sdk.scdn.co/spotify-player.js"></script>
</svelte:head>
