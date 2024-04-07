<script>
	import { goto } from '$app/navigation';
	import TokenAutoRefresher from '$lib/components/auth/TokenAutoRefresher.svelte';
	import Sidebar from '$lib/components/common/sidebar.svelte';
	import WebPlayerListener from '$lib/components/listeners/WebPlayerListener.svelte';
	import { auth } from '$lib/stores/auth.store';
	import { spotifyPlayerReady } from '$lib/stores/spotify.store';

	if (!$auth.isLoggedIn) goto('/');
</script>

<TokenAutoRefresher />
<WebPlayerListener />

{#if $spotifyPlayerReady}
	<Sidebar />

	<div class="p-4 relative">
		<slot />
	</div>
{:else}
	<div>Loading</div>
{/if}
