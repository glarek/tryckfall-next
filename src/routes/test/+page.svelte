<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

Tjena

<h2>Felsökningstest</h2>
<form method="POST" action="?/testAction" use:enhance>
	<button type="submit" style="background: #ffcc00; color: black; padding: 8px;">
		Kör Test Action
	</button>
</form>

{form?.testData.message}
