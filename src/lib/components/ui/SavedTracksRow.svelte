<script lang="ts">
	import SavedTracksList from './SavedTracksList.svelte';

	$: open = false;
</script>

<div class="mb-1">
	<button on:click={() => (open = !open)} class="flex gap-2 text-left hover:bg-white/5">
		<span class:rotate-90={open}>▶</span>
		<div class="whitespace-nowrap overflow-hidden overflow-ellipsis w-56">Likes Songs</div>
	</button>

	{#if open}
		<SavedTracksList on:track-info:mouseleave {open}></SavedTracksList>
	{/if}
</div>
