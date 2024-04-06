<script lang="ts">
	import TracksInPlaylist from './TracksInPlaylist.svelte';

	export let id: string;
	export let name: string;

	$: open = false;
</script>

<div class="mb-1">
	<button on:click={() => (open = !open)} class="flex gap-2 text-left">
		<span class:rotate-90={open}>▶</span>
		<div class="whitespace-nowrap overflow-hidden overflow-ellipsis w-56">{name}</div>
	</button>

	{#if open}
		<TracksInPlaylist {id} {open}></TracksInPlaylist>
	{/if}
</div>
