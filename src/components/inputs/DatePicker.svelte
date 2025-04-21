<script lang="ts">
    import { DatePicker } from "bits-ui";

    import CalendarBlank    from "phosphor-svelte/lib/CalendarBlank";
    import CaretLeft        from "phosphor-svelte/lib/CaretLeft";
    import CaretRight       from "phosphor-svelte/lib/CaretRight";

    export let label = "";
</script>

<DatePicker.Root weekdayFormat="short" fixedWeeks={true}>
    <div class="flex w-full flex-col gap-1.5">
        <DatePicker.Label class="text-sm font-orbitron text-white mb-1">
            {label}
        </DatePicker.Label>

        <DatePicker.Input
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue hover:border-neon-blue focus:outline-none text-white select-none flex items-center tracking-[0.01em]"
        >
            {#snippet children({ segments })}
                {#each segments as { part, value }}
                    <div class="inline-block select-none">
                        {#if part === "literal"}
                            <DatePicker.Segment {part} class="text-white/70 p-1">
                                {value}
                            </DatePicker.Segment>
                        {:else}
                            <DatePicker.Segment
                                {part}
                                class="rounded-md hover:bg-space-blue/70 focus:bg-space-blue/70 focus:text-white aria-[valuetext=Empty]:text-white/50 focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
                            >
                                {value}
                            </DatePicker.Segment>
                        {/if}
                    </div>
                {/each}
                <DatePicker.Trigger
                    class="text-neon-blue hover:bg-space-blue/70 active:bg-space-blue/90 ml-auto inline-flex size-8 items-center justify-center rounded-md transition-all"
                >
                    <CalendarBlank class="size-6" />
                </DatePicker.Trigger>
            {/snippet}
        </DatePicker.Input>

        <DatePicker.Content sideOffset={14} class="z-50">
            <DatePicker.Calendar
                class="border-neon-blue/30 bg-space-blue shadow-lg rounded-lg border p-4"
            >
            {#snippet children({ months, weekdays })}
                <DatePicker.Header class="flex items-center justify-between">
                    <DatePicker.PrevButton
                        class="rounded-lg bg-space-blue hover:bg-space-blue/70 text-neon-blue inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
                    >
                        <CaretLeft class="size-6" />
                    </DatePicker.PrevButton>

                    <DatePicker.Heading class="text-[15px] font-orbitron text-white" />

                    <DatePicker.NextButton
                        class="rounded-lg bg-space-blue hover:bg-space-blue/70 text-neon-blue inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
                    >
                        <CaretRight class="size-6" />
                    </DatePicker.NextButton>
                </DatePicker.Header>
                <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    {#each months as month}
                        <DatePicker.Grid class="w-full border-collapse select-none space-y-1">
                            <DatePicker.GridHead>
                                <DatePicker.GridRow class="mb-1 flex w-full justify-between">
                                    {#each weekdays as day}
                                        <DatePicker.HeadCell class="text-neon-blue/70 font-orbitron w-10 rounded-md text-xs">
                                            <div>{day.slice(0, 2)}</div>
                                        </DatePicker.HeadCell>
                                    {/each}
                                </DatePicker.GridRow>
                            </DatePicker.GridHead>

                            <DatePicker.GridBody>
                                {#each month.weeks as weekDates}
                                    <DatePicker.GridRow class="flex w-full">
                                        {#each weekDates as date}
                                            <DatePicker.Cell
                                                {date}
                                                month={month.value}
                                                class="p-0! relative size-10 text-center text-sm"
                                            >
                                                <DatePicker.Day
                                                    class="rounded-md text-white hover:bg-neon-blue/20 hover:border-neon-blue data-[selected]:bg-dark-blue/80 data-[selected]:border-neon-blue data-[disabled]:text-white/30 data-[selected]:text-neon-blue data-[unavailable]:text-white/50 data-[disabled]:pointer-events-none data-[outside-month]:text-gray-500 data-[outside-month]:opacity-50 data-[today]:underline data-[today]:decoration-neon-blue data-[today]:decoration-2 data-[selected]:font-bold data-[unavailable]:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
                                                >
                                                    <div
                                                        class="bg-neon-blue group-data-selected:bg-white group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
                                                    ></div>
                                                    {date.day}
                                                </DatePicker.Day>
                                            </DatePicker.Cell>
                                        {/each}
                                    </DatePicker.GridRow>
                                {/each}
                            </DatePicker.GridBody>
                        </DatePicker.Grid>
                    {/each}
                </div>
            {/snippet}
            </DatePicker.Calendar>
        </DatePicker.Content>
    </div>
</DatePicker.Root>