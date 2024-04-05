<script lang="ts">
	import { spotifyPlayer, spotifySdk } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import { onMount } from 'svelte';

	let data: any;
	onMount(async () => {
		data = await $spotifySdk?.currentUser.profile();
	});
</script>

<div>{$currentTrack?.name}</div>

<button on:click={() => $spotifyPlayer?.togglePlay()}>Play</button>
