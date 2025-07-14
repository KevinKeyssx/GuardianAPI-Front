<script lang="ts">
    import { onMount, type Snippet } from 'svelte';

    const {
        id,
        type,
        title,
        buttonText = 'Open',
        buttonClass = 'px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300 flex items-center',
        isEdit = false,
        form
    } = $props<{
        id: string;
        type: 'user' | 'attribute' | 'secret' | 'role';
        title: string;
        buttonText?: string;
        buttonClass?: string;
        isEdit?: boolean;
        form?: Snippet;
    }>();

    let isModalOpen = $state(false);
    // svelte-ignore non_reactive_update
    let modalContainer: HTMLElement;
    // svelte-ignore non_reactive_update
    let modalContent: HTMLElement;

    function openModal() {
        isModalOpen = true;

        // Necesitamos esperar a que el DOM se actualice
        setTimeout(() => {
            if (modalContainer) {
                // Mover el modal al body para asegurar que esté fuera de cualquier contenedor
                document.body.appendChild(modalContainer);
                modalContainer.style.display = 'flex';

                // Iniciar animación
                setTimeout(() => {
                    modalContainer.classList.add('opacity-100');
                    modalContainer.classList.add('bg-space-blue/10');
                    modalContainer.classList.add('backdrop-blur-sm');

                    if (modalContent) {
                        modalContent.classList.remove('scale-95');
                        modalContent.classList.add('scale-100');
                    }
                }, 10);
            }
        }, 0);
    }

    function closeModal() {
        if (modalContainer && modalContent) {
            modalContainer.classList.remove('bg-space-blue/10');
            modalContainer.classList.remove('backdrop-blur-sm');
            modalContainer.classList.remove('opacity-100');
            modalContainer.classList.add('bg-black/0');
            modalContainer.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');

            setTimeout(() => {
                isModalOpen = false;
            }, 300);
        } else {
            isModalOpen = false;
        }
    }

    function handleSave() {
        const event = new CustomEvent('itemUpdated', {
            detail: {
                id,
                type
            }
        });
        document.dispatchEvent(event);
        closeModal();
    }

    function handleOutsideClick(e: MouseEvent) {
        if (e.target === modalContainer) {
            closeModal();
        }
    }

    // Exponer funciones globalmente para uso programático
    onMount(() => {
        if (id) {
            (window as any)[`openModal_${id}`] = openModal;
            (window as any)[`closeModal_${id}`] = closeModal;
            
            return () => {
                delete (window as any)[`openModal_${id}`];
                delete (window as any)[`closeModal_${id}`];
            };
        }
    });
</script>

<!-- Botón para abrir el modal -->
<button 
    class={`edit-item-btn h-10 gap-1 ${buttonClass}`} 
    data-id={id} 
    data-type={type}
    onclick={openModal}
>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>

    <span class="hidden sm:block">
        {buttonText}
    </span>
</button>

<!-- El modal -->
{#if isModalOpen}
    <section
        bind:this={modalContainer}
        class="animate-fade-in fixed inset-0 bg-space-blue/10 backdrop-blur-sm items-center justify-center z-[9999] opacity-0 transition-all duration-300 ease-in-out"
        style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;"
        onclick={handleOutsideClick}
        onkeydown={(e) => e.key === 'Escape' && closeModal()}
        role="dialog"
        tabindex="-1"
        aria-modal="true"
    >
        <div
            bind:this={modalContent}
            class="bg-dark-blue/80 border border-neon-blue/30 rounded-lg p-6 w-full max-w-md transform scale-95 transition-all duration-300 ease-in-out absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            role="document"
        >
            <header class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-orbitron text-white px-4 py-2">
                    {title}
                </h3>
                <button class="text-gray-400 hover:text-white" onclick={closeModal} aria-label="Cerrar modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </header>

            <main class="form-content">
                {@render form()}
            </main>

            <footer class="flex justify-end space-x-3 mt-6">
                <button 
                    class="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
                    onclick={closeModal}
                >
                    Cancel
                </button>
                <button 
                    class="px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300"
                    onclick={handleSave}
                >
                    Save Changes
                </button>
            </footer>
        </div>
    </section>
{/if}
