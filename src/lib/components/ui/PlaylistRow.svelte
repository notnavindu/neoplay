<script lang="ts">
	import TracksInPlaylist from './TracksInPlaylist.svelte';

	export let id: string;
	export let name: string;
	export let playlistContextUri: string;

	$: open = false;
</script>

<div class="mb-1">
	<button on:click={() => (open = !open)} class="flex gap-2 text-left hover:bg-white/5">
		<span class:rotate-90={open}>▶</span>
		<div class="whitespace-nowrap overflow-hidden overflow-ellipsis w-56">{name}</div>
	</button>

	{#if open}
		<TracksInPlaylist {id} {open} {playlistContextUri}></TracksInPlaylist>
	{/if}
</div>
