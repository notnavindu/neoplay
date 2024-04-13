<script>
	import { leftSidebarOpen } from '$lib/stores/ui.store';
	import PlayingDevice from '../ui/PlayingDevice.svelte';
	import UserPlaylists from '../ui/UserPlaylists.svelte';
	import Queue from './queue.svelte';
</script>

<div class="max-h-screen w-64 border-r border-neo-gray-1 flex flex-col flex-shrink-0">
	<div class="px-4 py-2 border-b border-neo-gray-1 flex justify-between items-center">
		<h3 class="text-neo-blue text-lg">neoplay</h3>

		<button
			class=" bg-neo-blue z-40 h-fit px-2 py-1 leading-1"
			on:click={() => ($leftSidebarOpen = !$leftSidebarOpen)}>←</button
		>
	</div>

	<div class="flex-grow overflow-scroll border-b border-neo-gray-1 p-4">
		<UserPlaylists />
	</div>

	<Queue />
	<PlayingDevice />
</div>
