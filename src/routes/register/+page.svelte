<script>
	import RegisterForm from '$lib/components/RegisterForm.svelte';
	let { data } = $props();
	let formData = data.form;
</script>

<div class="bg-background flex flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-sm">
		<RegisterForm {formData} />
	</div>
</div>
