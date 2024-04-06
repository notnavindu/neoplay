<script lang="ts">
	export let key: string;
	export let value: string | number | undefined;
</script>

<div class="flex gap-1 line-clamp-1">
	<span class="font-semibold text-neo-blue">{key}:</span>
	<span>{value ?? 'Not Found'}</span>
</div>
