<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let closable = false;
	const dispatch = createEventDispatcher();

	const closeModal = () => {};
</script>

<div
	class="w-full h-screen fixed inset-0 backdrop-blur-sm backdrop-brightness-90 flex items-center justify-center"
>
	<div class="w-full max-w-sm bg-black p-4 border border-white relative">
		{#if closable}
			<div class="bg-white w-4 h-4 absolute right-0 top-0 flex items-center justify-center">x</div>
		{/if}
		<slot />
	</div>
</div>
