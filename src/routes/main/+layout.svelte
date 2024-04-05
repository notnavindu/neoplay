<script>
	import { goto } from '$app/navigation';
	import TokenAutoSave from '$lib/components/auth/TokenAutoSave.svelte';
	import Sidebar from '$lib/components/common/sidebar.svelte';
	import WebPlayerListener from '$lib/components/web-player/WebPlayerListener.svelte';
	import { auth } from '$lib/stores/auth.store';
	import { spotifyPlayerReady } from '$lib/stores/spotify.store';

	if (!$auth.isLoggedIn) goto('/');
</script>

<TokenAutoSave />
<WebPlayerListener />

{#if $spotifyPlayerReady}
	<Sidebar />

	<div class="p-4">
		<slot />
	</div>
{:else}
	<div>Loading</div>
{/if}
