<script>
	import { spotifyPlaybackState } from '$lib/stores/spotify.store';
</script>

<div class="p-4">
	{#if $spotifyPlaybackState}
		<div>// PLAYING ON: <span class="text-neo-blue">This Device</span></div>
	{/if}
</div>
