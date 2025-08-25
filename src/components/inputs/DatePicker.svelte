<script lang="ts">
    type DateValue = Date | string;


    export type Props = {
        id?         : string;
        value?      : DateValue | string | null | undefined;
        label?      : string;
        required?   : boolean;
        disabled?   : boolean;
        minDate?    : DateValue;
        maxDate?    : DateValue;
        error?      : string;
        onInput?    : () => void;
    }


    let {
        id = `datepicker-${Math.random().toString(36).substr(2, 9)}`,
        value = $bindable(),
        label,
        required = false,
        disabled = false,
        minDate,
        maxDate,
        error,
        onInput
    }: Props = $props();


    let isOpen          = $state( false );
    let currentMonth    = $state( new Date().getMonth() );
    let currentYear     = $state( new Date().getFullYear() );

    // Convert various date formats to Date object
    function parseDate( date: any ): Date | null {
        if ( !date ) return null;
        if ( date instanceof Date ) return date;
        if ( typeof date === 'string' ) {
            const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
            const match = date.match(dateRegex);

            if ( match ) {
                const [, year, month, day] = match;
                return new Date( parseInt( year ), parseInt( month ) - 1, parseInt( day ));
            }

            const parsed = new Date( date );

            return isNaN( parsed.getTime() ) ? null : parsed;
        }

        return null;
    }


    function formatDate( date: Date | null ): string {
        if ( !date ) return '';

        return date.toLocaleDateString( 'en-US', {
            year    : 'numeric',
            month   : 'short',
            day     : 'numeric'
        });
    }


    const selectedDate = $derived( parseDate( value ));
    const displayValue = $derived( formatDate( selectedDate ));


    // Calendar navigation
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const dayNames = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];

    // Get days in current month view
    const calendarDays = $derived.by(() => {
        const firstDay = new Date( currentYear, currentMonth, 1 );
        const startDate = new Date( firstDay );

        startDate.setDate( startDate.getDate() - firstDay.getDay() );

        const days = [];
        const current = new Date( startDate );

        for ( let i = 0; i < 42; i++ ) { // 6 weeks * 7 days
            days.push( new Date( current ));
            current.setDate( current.getDate() + 1 );
        }

        return days;
    });


    // Check if date is in current month
    const isCurrentMonth = ( date: Date ): boolean =>
        date.getMonth() === currentMonth && date.getFullYear() === currentYear;


    // Check if date is selected
    function isSelected( date: Date ): boolean {
        if ( !selectedDate ) return false;

        return date.getFullYear() === selectedDate.getFullYear()
            && date.getMonth() === selectedDate.getMonth()
            && date.getDate() === selectedDate.getDate();
    }

    // Check if date is disabled
    function isDateDisabled( date: Date ): boolean {
        if ( disabled ) return true;

        const minDateObj    = parseDate( minDate );
        const maxDateObj    = parseDate( maxDate );
        const dateOnly      = new Date( date.getFullYear(), date.getMonth(), date.getDate() );

        if ( minDateObj ) {
            const minDateOnly = new Date( minDateObj.getFullYear(), minDateObj.getMonth(), minDateObj.getDate() );

            if ( dateOnly < minDateOnly ) return true;
        }

        if ( maxDateObj ) {
            const maxDateOnly = new Date( maxDateObj.getFullYear(), maxDateObj.getMonth(), maxDateObj.getDate() );

            if ( dateOnly > maxDateOnly ) return true;
        }

        return false;
    }


    // Check if date is today
    function isToday( date: Date ): boolean {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // Handle date selection
    function selectDate( date: Date ): void {
        if ( isDateDisabled( date )) return;

        const year      = date.getFullYear();
        const month     = String( date.getMonth() + 1 ).padStart( 2, '0' );
        const day       = String( date.getDate() ).padStart( 2, '0' );
        const newValue  = `${year}-${month}-${day}`;

        // Update the bindable value
        value   = newValue;
        isOpen  = false;
        // Trigger the onInput callback to notify parent component
        if ( onInput ) onInput();
    }

    // Navigation functions
    function previousMonth(): void {
        if ( currentMonth === 0 ) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
    }


    function nextMonth(): void {
        if ( currentMonth === 11 ) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
    }

    // Close calendar when clicking outside
    function handleClickOutside( event: MouseEvent ): void {
        const target = event.target as Element;

        if ( !target.closest( `#${id}-container` )) {
            isOpen = false;
        }
    }

    // Generate unique IDs for accessibility
    const errorId       = `${id}-error`;
    const calendarId    = `${id}-calendar`;
</script>

<svelte:window onclick={ handleClickOutside } />

<div class="space-y-2" id="{id}-container">
    {#if label}
        <label 
            for={id} 
            class="text-sm font-orbitron text-white mb-1"
            class:opacity-50={disabled}
        >
            {label}

            {#if required}
                <span class="text-red-500 ml-1">*</span>
            {/if}
        </label>
    {/if}

    <div class="relative">
        <!-- Input field -->
        <button
            id={id}
            type="button"
            disabled={disabled}
            onclick={() => !disabled && (isOpen = !isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-describedby={error ? errorId : undefined}
            class="w-full px-3 py-1.5 bg-space-blue border {error ? 'border-red-500' : 'border-neon-blue/30'} rounded-lg focus:border-neon-blue hover:border-neon-blue focus:outline-none text-white select-none flex items-center tracking-[0.01em] text-left transition-colors duration-200"
            class:opacity-50={disabled}
            class:cursor-not-allowed={disabled}
            class:cursor-pointer={!disabled}
        >
            <span class="block truncate">
                { displayValue || 'Select date...' }
            </span>
        </button>

        <!-- Calendar icon -->
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg 
                class               = "h-6 w-6 text-neon-blue"
                class:opacity-50    = { disabled }
                fill                = "none" 
                viewBox             = "0 0 24 24"
                stroke              = "currentColor"
            >
                <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
            </svg>
        </div>

        <!-- Calendar dropdown -->
        {#if isOpen}
            <div 
                id          = { calendarId }
                class       = "absolute z-50 mt-1 w-80 border-neon-blue/30 bg-space-blue shadow-lg rounded-lg border p-4"
                role        = "dialog"
                aria-label  = "Calendar"
            >
                <!-- Calendar header -->
                <div class="flex items-center justify-between mb-4">
                    <button
                        type        = "button"
                        onclick     = { previousMonth }
                        class       = "rounded-lg bg-space-blue hover:bg-space-blue/70 text-neon-blue inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
                        aria-label  = "Previous month"
                    >
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h2 class="text-[15px] font-orbitron text-white">
                        { monthNames[currentMonth] } { currentYear }
                    </h2>

                    <button
                        type        = "button"
                        onclick     = { nextMonth }
                        class       = "rounded-lg bg-space-blue hover:bg-space-blue/70 text-neon-blue inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
                        aria-label  = "Next month"
                    >
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <!-- Calendar grid -->
                <div>
                    <!-- Day headers -->
                    <div class="flex w-full justify-between mb-2">
                        {#each dayNames as dayName}
                        <div class="text-neon-blue/70 font-orbitron w-10 rounded-md text-xs text-center py-2">
                            { dayName.slice( 0, 2 )}
                        </div>
                        {/each}
                    </div>

                    <!-- Calendar days -->
                    <div class="grid grid-cols-7 gap-1">
                        {#each calendarDays as day}
                            <button
                                type        = "button"
                                onclick     = {() => selectDate( day )}
                                disabled    = { isDateDisabled( day )}
                                class       = { `relative size-10 text-center text-sm rounded-md text-white hover:bg-neon-blue/20 hover:border-neon-blue border border-transparent bg-transparent p-0 font-normal transition-all inline-flex items-center justify-center whitespace-nowrap ${
                                    !isCurrentMonth(day) && !isDateDisabled(day) ? 'text-gray-500 opacity-50' :
                                    isCurrentMonth(day) && !isSelected(day) && !isToday(day) && !isDateDisabled(day) ? 'text-white' :
                                    isSelected(day) ? 'bg-neon-blue/30 border-neon-blue text-neon-blue font-bold ring-2 ring-neon-blue' :
                                    isToday(day) && !isSelected(day) && !isDateDisabled(day) ? 'underline decoration-neon-blue decoration-2' :
                                    isDateDisabled(day) ? 'cursor-not-allowed text-white/30 pointer-events-none' :
                                    !isSelected(day) && !isDateDisabled(day) && isCurrentMonth(day) ? '' : ''
                                }`}
                                aria-label={ day.toLocaleDateString( 'en-US', { 
                                    weekday : 'long', 
                                    year    : 'numeric', 
                                    month   : 'long', 
                                    day     : 'numeric' 
                                })}
                            >
                                {#if isToday( day ) && !isSelected( day )}
                                    <div class="bg-neon-blue absolute top-[5px] size-1 rounded-full"></div>
                                {/if}

                                { day.getDate() }
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        {/if}
    </div>

    {#if error}
        <span class="text-red-500 text-sm mt-1">{error}</span>
    {/if}
</div>
