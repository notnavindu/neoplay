<script lang="ts">
	import MatrixContainer from '$lib/components/ui/TimeMatrix/MatrixContainer.svelte';
	import { currentTrack } from '$lib/stores/track.store';
</script>

{#if $currentTrack}
	<MatrixContainer />
{/if}
