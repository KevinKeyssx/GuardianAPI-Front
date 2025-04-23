<script lang="ts">
    import { onMount } from 'svelte';

    let {
        id,
        title,
        // saveButtonText      = "Save",
        // cancelButtonText    = "Cancel",
        buttonText          = "Open Panel",
        buttonClass         = "px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300 flex items-center",
        isEdit              = false,
        isPanelOpen         = false
    } = $props<{
        id                  : string;
        title               : string;
        // saveButtonText?     : string;
        // cancelButtonText?   : string;
        buttonText?         : string;
        buttonClass?        : string;
        isEdit?             : boolean;
        isPanelOpen?        : boolean;
    }>();

    // let isPanelOpen = $state( false );
    // svelte-ignore non_reactive_update
    let panelContainer: HTMLElement;
    // svelte-ignore non_reactive_update
    let panelSection: HTMLElement;

    $effect(() => {
        if( isPanelOpen ) {
            openPanel()
        }
        else {
            closePanel()
        }
    });

    function openPanel() {
        isPanelOpen = true;

        setTimeout(() => {
            if (panelContainer) {
                document.body.appendChild(panelContainer);
                panelContainer.style.display = 'flex';

                setTimeout(() => {
                    panelContainer.classList.add('opacity-100');

                    if ( panelSection ) {
                        panelSection.classList.remove('translate-x-full');
                        panelSection.classList.add('translate-x-0');
                    }
                }, 10);
            }
        }, 0);
    }

    function closePanel() {
        if (panelContainer && panelSection) {
            panelContainer.classList.remove('opacity-100');
            panelSection.classList.remove('translate-x-0');
            panelSection.classList.add('translate-x-full');

            setTimeout(() => {
                isPanelOpen = false;
            }, 300);
        } else {
            isPanelOpen = false;
        }
    }

    function handleSave() {
        const saveEvent = new CustomEvent('panel:save', { detail: { panelId: id } });
        document.dispatchEvent(saveEvent);
        closePanel();
    }

    onMount(() => {
        if (id) {
            (window as any)[`openPanel_${id}`] = openPanel;
            (window as any)[`closePanel_${id}`] = closePanel;

            return () => {
                delete (window as any)[`openPanel_${id}`];
                delete (window as any)[`closePanel_${id}`];
            };
        }
    });
</script>

<button 
    class   = { `open-panel-btn h-10 gap-1 ${buttonClass} ${isEdit ? 'text-neon-blue' : ''}` }
    onclick = { openPanel }
>
    {#if isEdit}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
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
        class       = "fixed inset-0 bg-space-blue/10 backdrop-blur-sm flex items-end justify-end sm:items-center sm:justify-end z-[9999] opacity-0 transition-all duration-300 ease-in-out"
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

            <main class="p-6 flex-grow overflow-y-auto">
                <!-- svelte-ignore slot_element_deprecated -->
                <slot />
            </main>

            <footer class="flex justify-end space-x-3 p-4 border-t border-neon-blue/30 bg-dark-blue/90 sticky bottom-0">
                <button
                    class="close-panel px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                    onclick={closePanel}
                >
                    <!-- {cancelButtonText} -->
                    Cancel
                </button>

                <button
                    class="save-panel px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300"
                    onclick={handleSave}
                >
                    <!-- {saveButtonText} -->
                    Save
                </button>
                <!-- <slot name="footer" /> -->
            </footer>
        </aside>
    </div>
{/if}