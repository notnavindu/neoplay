<script lang="ts">
	import CurrentTrack from '$lib/components/web-player/CurrentTrack.svelte';
	import { spotifyPlayer } from '$lib/stores/spotify.store';
</script>

<div class="w-full">
	<CurrentTrack />
</div>
<button on:click={() => $spotifyPlayer?.togglePlay()}>Play</button>
