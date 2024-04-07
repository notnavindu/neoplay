<script lang="ts">
	import CurrentTrack from '$lib/components/ui/CurrentTrack.svelte';
	import MatrixContainer from '$lib/components/ui/TimeMatrix/MatrixContainer.svelte';
	import { currentTrack } from '$lib/stores/track.store';
</script>

<div class="w-full h-full">
	{#if !$currentTrack}
		<div>No track</div>
	{:else}
		<CurrentTrack />
		<MatrixContainer />
	{/if}
</div>
