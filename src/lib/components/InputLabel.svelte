<script>
	let {
		description = { text: undefined, class: {}, tag: undefined },
		input = { class: {} },
		labelType = 'default',
		options = undefined,
		unitSwitch = $bindable(false),
		secondaryUnit = false,
		inputBind = $bindable(undefined),
		selectBind = $bindable(undefined),
		...rest
	} = $props();
</script>

<label class="flex items-center gap-x-2">
	<span class="my-2 inline-flex {description.class}">{description.text ?? ''}</span>

	{#if labelType === 'number'}
		<input
			type="number"
			class="w-15 rounded-sm bg-input p-1 {input.class}"
			bind:value={inputBind}
			{...rest}
		/><span>{description.tag ?? ''}</span>
	{:else if labelType === 'select'}
		<select class="rounded-sm bg-input p-1" bind:value={selectBind} {...rest}>
			{#each options as option}
				<option value={option}>{option.name}</option>
			{/each}
		</select>
	{:else if labelType === 'selectAndInput'}
		<input
			type="number"
			class="rounded-sm bg-slate-200 p-1 text-xs text-ellipsis {input.class}"
			bind:value={inputBind}
			oninput={() => (secondaryUnit ? (unitSwitch = true) : (unitSwitch = false))}
			min={0}
			{...rest}
		/>
		<select
			class="rounded-sm bg-slate-200 p-1 text-xs"
			bind:value={selectBind}
			oninput={() => (secondaryUnit ? (unitSwitch = false) : (unitSwitch = true))}
		>
			{#each options as option}
				<option value={option}>{option.unit}</option>
			{/each}
		</select>
	{/if}
</label>
