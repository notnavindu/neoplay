<script>
	import Sidebar from '$lib/components/common/sidebar.svelte';
	import '@fontsource/geist-mono/400.css';
	import '@fontsource/geist-mono/500.css';
	import '@fontsource/geist-mono/600.css';
	import '@fontsource/geist-mono/700.css';
	import '../app.css';
	import { auth } from '$lib/stores/auth.store';
	import { goto } from '$app/navigation';

	if ($auth.isLoggedIn) goto('/main');
</script>

<main class="bg-neo-black w-full min-h-screen text-white flex text-xs">
	<slot />
</main>
