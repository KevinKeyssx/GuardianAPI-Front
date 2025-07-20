<script lang="ts">
	import { Pagination } from "bits-ui";
	import CaretLeft from "phosphor-svelte/lib/CaretLeft";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import Select from "../../inputs/Select.svelte";

	// Props interface for the component
	type Props = {
		count               : number;
		perPage?            : number;
		currentPage?        : number;
		showPerPage?        : boolean;
		onPageChange?       : ( page: number ) => void;
		onPerPageChange?    : ( perPage: number ) => void;
	};

	let {
		count,
		perPage     = $bindable( 10 ),
		currentPage = $bindable( 1 ),
		showPerPage = true,
		onPageChange,
		onPerPageChange,
	}: Props = $props();

	const perPageOptions = [
		{ label: "10", value: "10" },
		{ label: "15", value: "15" },
		{ label: "20", value: "20" },
		{ label: "30", value: "30" },
		{ label: "50", value: "50" },
	];

	// Handle page change
	function handlePageChange( page: number ) {
		currentPage = page;

        if ( onPageChange ) onPageChange( page );
	}

	// Handle per page change
	function handlePerPageChange( value: string ) {
		const newPerPage = parseInt( value );
		perPage = newPerPage;
		currentPage = 1; // Reset to first page when changing items per page
		if ( onPerPageChange ) {
			onPerPageChange( newPerPage );
		}
	}
</script>

<Pagination.Root 
	{count} 
	{perPage} 
	page={currentPage}
	onPageChange={handlePageChange}
>
	{#snippet children({ pages, range })}
		<div class="flex flex-col sm:flex-row justify-between gap-4 items-center">
			<!-- Items per page selector -->
			{#if showPerPage}
				<div class="flex items-center gap-2">
					<span class="text-sm text-white/70 font-orbitron">Show:</span>

                    <div class="w-24">
						<Select
                            value       = { perPage.toString() }
							options     = { perPageOptions }
							onChange    = { handlePerPageChange }
							placeholder = "10"
                            id          = "per-page"
                            name        = "per-page"
						/>
					</div>

                    <span class="text-sm text-white/70 font-orbitron">per page</span>
				</div>
			{/if}

            <!-- Results info -->
			<div class="text-sm text-white/70 font-orbitron">
				Showing {range.start} - {range.end} of {count} results
			</div>

			<!-- Pagination controls -->
			<div class="flex items-center gap-2">
				<Pagination.PrevButton
					class="hover:bg-neon-blue/20 hover:border-neon-blue disabled:text-white/30 disabled:hover:bg-transparent disabled:hover:border-neon-blue/30 inline-flex size-10 items-center justify-center rounded-lg bg-space-blue border border-neon-blue/30 text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
				>
					<CaretLeft class="size-5" />
				</Pagination.PrevButton>

				<div class="flex items-center gap-1">
					{#each pages as page (page.key)}
						{#if page.type === "ellipsis"}
							<div class="text-white/50 select-none text-sm font-medium px-2">
								...
							</div>
						{:else}
							<Pagination.Page
								{page}
								class="data-[selected]:bg-neon-blue data-[selected]:text-dark-blue data-[selected]:border-neon-blue data-[selected]:shadow-lg data-[selected]:shadow-neon-blue/25 hover:bg-neon-blue/20 hover:border-neon-blue inline-flex size-10 select-none items-center justify-center rounded-lg bg-space-blue border border-neon-blue/30 text-sm font-medium text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{page.value}
							</Pagination.Page>
						{/if}
					{/each}
				</div>

				<Pagination.NextButton
					class="hover:bg-neon-blue/20 hover:border-neon-blue disabled:text-white/30 disabled:hover:bg-transparent disabled:hover:border-neon-blue/30 inline-flex size-10 items-center justify-center rounded-lg bg-space-blue border border-neon-blue/30 text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
				>
					<CaretRight class="size-5" />
				</Pagination.NextButton>
			</div>
		</div>
	{/snippet}
</Pagination.Root>
