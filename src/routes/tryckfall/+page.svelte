<script>
	import { Worm, Wind } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	    import { base } from '$app/paths';

</script>

<div class="text-center py-8 md:py-32 max-w-2xl mx-auto">
	<h1 class="text-5xl font-semibold tracking-tighter text-balance text-primary sm:text-7xl">
		Beräkna tryckfall med enkelhet
	</h1>
	<p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
		Lägg inte tid på gamla tryckfallsdiagram och utdaterade programvaror. Använd de senaste
		metoderna med beräkningsmoduler från Coolprop för att alltid ha korrekta sätt att räkna.
	</p>
	<div class="mt-10 flex flex-col md:flex-row gap-y-3 items-center justify-center md:gap-x-6">
		<Button
			variant="outline"
			size="lg"
			href="{base}/tryckfall/ror"
			class="transition-all w-full md:w-[160px] font-semibold"
		>
			<div class="flex flex-row gap-x-2 items-center text-lg">
				<Worm size="1.2em" />Rörtryckfall
			</div>
		</Button>
		<Button
			variant="outline"
			size="lg"
			href="{base}/tryckfall/luft"
			class="transition-all w-full md:w-[160px] font-semibold"
		>
			<div class="flex flex-row gap-x-2 items-center text-lg">
				<Wind size="1.2em" />Kanaltryckfall
			</div>
		</Button>
	</div>
</div>
<div
	class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
	aria-hidden="true"
></div>
