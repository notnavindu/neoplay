<script>
	import Queue from './queue.svelte';
</script>

<div class="max-h-screen w-72 border-r border-neo-gray-1 flex flex-col flex-shrink-0">
	<h3 class="text-neo-blue px-4 py-2 text-lg border-b border-neo-gray-1">neoplay</h3>

	<div class="flex-grow bg-red-900 overflow-scroll border-b border-neo-gray-1"></div>

	<Queue />

	<div class="p-4">// PLAYING ON</div>
</div>
