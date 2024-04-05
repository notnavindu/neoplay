<script>
	import { goto } from '$app/navigation';
	import TokenAutoSave from '$lib/components/auth/TokenAutoSave.svelte';
	import Sidebar from '$lib/components/common/sidebar.svelte';
	import { auth } from '$lib/stores/auth.store';

	if (!$auth.isLoggedIn) goto('/');
</script>

<TokenAutoSave />
<Sidebar />

<div class="p-4">
	<slot />
</div>
