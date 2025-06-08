<script>
	let { formula = '' } = $props();

	// Skapa en härledd (derived) konstant som innehåller den färdiga HTML-strängen.
	// Denna kommer automatiskt att beräknas om när `formula`-propen ändras.
	const htmlString = $derived(
		// Använd en regex för att hitta alla siffergrupper (\d+)
		// och slå in dem i <sub>-taggar.
		formula.replace(/(\d+)/g, '<sub>$1</sub>')
	);
</script>

<span class="chemical-formula">
	{@html htmlString}
</span>

<style>
	.chemical-formula {
		column-gap: 0px;
	}
</style>
