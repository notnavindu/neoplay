<script lang="ts">
	import { getUserProfile } from '$lib/actions/user.actions';
	import { onMount } from 'svelte';

	let data: any;
	onMount(async () => {
		data = await getUserProfile();
	});
</script>

this is where the content should go

{JSON.stringify(data)}
