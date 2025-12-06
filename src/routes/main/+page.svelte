<script lang="ts">
	import JustifiedLyrics from '$lib/components/ui/Lyrics/JustifiedLyrics.svelte';
	import { currentTrack } from '$lib/stores/track.store';
</script>

{#if $currentTrack}
	<!-- <Lyrics /> -->
	<JustifiedLyrics />
{/if}
