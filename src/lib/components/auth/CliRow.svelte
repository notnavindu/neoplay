<script lang="ts">
	export let hidePrompt = false;
	export let type: CliCommand['type'] = 'info';
</script>

<div class="w-full flex">
	{#if !hidePrompt}
		<div class="text-neo-blue mr-3 whitespace-nowrap">
			→ neoplay:<span class="text-white">~$</span>
		</div>
	{/if}
	<div
		placeholder="type 'login' to get started"
		class=" px-3 outline-none w-full bg-transparent"
		class:text-red-600={type == 'error'}
	>
		<slot />
	</div>
</div>
