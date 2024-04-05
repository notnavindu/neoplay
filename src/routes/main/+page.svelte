<script lang="ts">
	import { getUserProfile } from '$lib/actions/user.actions';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { onMount } from 'svelte';

	let data: any;
	onMount(async () => {
		data = await $spotifySdk?.currentUser.profile();
	});
</script>

this is where the content should go

{JSON.stringify(data)}
