<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string;
	export let placeholder: string;

	const dispatch = createEventDispatcher<{
		enterPress: void;
	}>();

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === 'Return') {
			dispatch('enterPress');
		}
	}
</script>

<div class="w-full flex items-center">
	<div class="text-neo-blue mr-3 whitespace-nowrap">
		→ neoplay:<span class="text-white">~$</span>
	</div>
	<input
		autofocus
		bind:value
		{placeholder}
		class="px-3 py-2 outline-none w-full bg-transparent"
		on:keyup={handleKeyUp}
	/>
</div>
