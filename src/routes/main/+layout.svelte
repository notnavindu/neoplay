<script>
	import { goto } from '$app/navigation';
	import Sidebar from '$lib/components/common/sidebar.svelte';
	import { auth } from '$lib/stores/auth.store';

	if (!$auth.isLoggedIn) goto('/');
</script>

<Sidebar />

<div class="p-4">
	<slot />
</div>
