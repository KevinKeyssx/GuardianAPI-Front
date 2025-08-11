<script lang="ts">
    import EditIcon from "@/icons/EditIcon.svelte";

    let {
        title,
        buttonText          = "Open Panel",
        buttonClass         = "px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300 flex items-center",
        isEdit              = false,
        isPanelOpen         = false,
        clicked             = $bindable<number>(),
    } = $props<{
        title               : string;
        buttonText?         : string;
        buttonClass?        : string;
        isEdit?             : boolean;
        isPanelOpen?        : boolean;
        clicked?            : number;
    }>();

    // svelte-ignore non_reactive_update
    let panelContainer: HTMLElement;
    // svelte-ignore non_reactive_update
    let panelSection: HTMLElement;
    let isActive = $state( false );
    
    $effect(() => {
        if ( isActive && clicked > 0 ) {
            closePanel();
        }
    });


    function openPanel() {
        isActive    = true;
        isPanelOpen = true;

        setTimeout(() => {
            if (panelContainer) {
                document.body.appendChild( panelContainer );
                panelContainer.style.display = 'flex';

                setTimeout(() => {
                    panelContainer.classList.add( 'opacity-100' );

                    if (panelSection) {
                        panelSection.classList.remove( 'translate-x-full' );
                        panelSection.classList.add( 'translate-x-0' );
                    }
                }, 10);
            }
        }, 0);
    }

    function closePanel() {
        clicked = 0;

        if ( panelContainer && panelSection ) {
            panelContainer.classList.remove( 'opacity-100' );
            panelSection.classList.remove( 'translate-x-0' );
            panelSection.classList.add( 'translate-x-full' );

            setTimeout(() => {
                isPanelOpen = false;
                isActive    = false;
            }, 300);
        } else {
            isPanelOpen = false;
            isActive    = false;
        }
    }
</script>

<button 
    class   = { `open-panel-btn h-10 gap-1 ${buttonClass} ${isEdit ? 'text-neon-blue' : ''} hover:bg-neon-blue/20 transition-all p-2 rounded-md` }
    onclick = { openPanel }
>
    {#if isEdit}
        <EditIcon />
    {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    {/if}

    <span class="hidden sm:block">
        { buttonText }
    </span>
</button>

{#if isPanelOpen}
    <div
        bind:this   = { panelContainer }
        class       = "fixed inset-0 bg-space-blue/10 backdrop-blur-sm flex items-end justify-end sm:items-center sm:justify-end z-[999] opacity-0 transition-all duration-300 ease-in-out"
        style       = "display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;"
        onclick     = {( e ) => e.target === panelContainer && closePanel()}
        onkeydown   = {( e ) => e.key === 'Escape' && closePanel()}
        role        = "dialog"
        tabindex    = "-1"
        aria-modal  = "true"
    >
        <aside
            bind:this   = { panelSection }
            class       ="bg-dark-blue/80 border-l border-neon-blue/30 h-full w-full max-w-md transform translate-x-full transition-all duration-300 ease-in-out flex flex-col overflow-hidden absolute right-0 top-0"
        >
            <header class="flex justify-between items-center px-6 py-4 border-b border-neon-blue/30">
                <h3 class="text-xl font-orbitron text-white">{title}</h3>

                <button aria-label="Cerrar panel" class="close-panel text-gray-400 hover:text-white" onclick={closePanel}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </header>
            <!-- svelte-ignore slot_element_deprecated -->
            <slot />
        </aside>
    </div>
{/if}
