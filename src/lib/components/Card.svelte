<script>
	let { children } = $props();
</script>

<div
	class="card flex flex-col bg-primary-foreground rounded-md border-border border-1 py-2 px-4 text-sm max-w-[300px]"
>
	{@render children()}
</div>
