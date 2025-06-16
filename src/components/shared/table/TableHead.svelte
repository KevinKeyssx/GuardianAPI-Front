<script lang="ts">
    import { onMount } from 'svelte';

    import { type ColumnProp, Popover } from '@/components/shared';

    export let columns: ColumnProp[] = [];

    // Estado local para manejar las columnas visibles
    $: visibleColumns = columns.map(col => ({
        ...col,
        isAction: col.column === 'Actions'
    }));
    
    // Función para manejar el toggle de columnas
    function handleColumnToggle(columnName: string, checked: boolean) {
        // Actualizar el estado local
        columns = columns.map(col => {
            if (col.column === columnName) {
                return { ...col, showColumn: checked };
            }
            return col;
        });
        
        // Guardar en localStorage
        try {
            const visibleColumns = JSON.parse(localStorage.getItem('visibleColumns') || '{}');
            visibleColumns[columnName] = checked;
            localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns));
            
            // Aplicar inmediatamente los cambios de visibilidad
            applyColumnVisibility();
            
            // Emitir un evento personalizado para que otros componentes puedan reaccionar
            // Esto mantiene la compatibilidad con código existente
            const event = new CustomEvent('columnToggle', {
                detail: {
                    columnName,
                    isVisible: checked
                },
                bubbles: true
            });
            
            document.dispatchEvent(event);
        } catch (error) {
            console.error('Error saving column visibility state:', error);
        }
    }
    
    // Función para aplicar estilos CSS para ocultar/mostrar columnas
    function applyColumnVisibility() {
        // Agregar un estilo global para ocultar las celdas de columnas ocultas
        const styleId = 'column-visibility-styles';
        let styleEl = document.getElementById(styleId);
        
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }
        
        // Generar reglas CSS para cada columna
        let cssRules = '';
        columns.forEach((col, index) => {
            if (!col.showColumn && col.column !== 'Actions') {
                // Ocultar todas las celdas en la posición de columna correspondiente
                cssRules += `
                    table tr td:nth-child(${index + 1}) { display: none !important; }
                `;
            }
        });
        
        styleEl.textContent = cssRules;
    }
    
    // Cargar el estado inicial desde localStorage
    onMount(() => {
        try {
            const visibleColumns = JSON.parse(localStorage.getItem('visibleColumns') || '{}');
            
            // Actualizar el estado de las columnas con los valores guardados
            columns = columns.map(col => {
                if (col.column in visibleColumns) {
                    return { ...col, showColumn: visibleColumns[col.column] };
                }
                return col;
            });
            
            // Aplicar estilos iniciales después de que el DOM esté listo
            setTimeout(applyColumnVisibility, 0);
        } catch (error) {
            console.error('Error loading column visibility state:', error);
        }

        // Limpiar estilos al desmontar el componente
        return () => {
            const styleEl = document.getElementById('column-visibility-styles');
            if (styleEl) {
                styleEl.remove();
            }
        };
    });
</script>

<thead class="bg-dark-blue/70 font-orbitron">
    <tr>
        {#each visibleColumns as { column: columnName, showColumn, isAction }, index}
            <th 
                scope="col" 
                class={`${isAction ? 'sticky bg-dark-blue/90 backdrop-blur-sm shadow-[-4px_0_5px_rgba(0,0,0,0.3)] right-0 z-10 text-center flex justify-center px-4' : 'px-6'} py-3 text-left text-xs font-medium text-neon-blue uppercase tracking-wider ${!showColumn ? 'hidden' : ''}`}
                data-column-name={columnName}
                data-column-index={index}
            >
                {#if isAction}
                    <Popover>
                        <div class="py-1">
                            <h3 class="text-neon-blue font-orbitron mb-3 border-b border-neon-blue/30 pb-1">Toggle Columns</h3>

                            <div class="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                                {#each columns as colItem}
                                    {#if colItem.column !== 'Actions'}
                                        <div class="flex items-center justify-between py-2">
                                            <label for={`column-toggle-${colItem.column}`} class="text-sm font-orbitron text-white cursor-pointer">{colItem.column}</label>

                                            <div class="relative">
                                                <input 
                                                    type="checkbox" 
                                                    id={`column-toggle-${colItem.column}`}
                                                    name={`column-toggle-${colItem.column}`}
                                                    checked={colItem.showColumn}
                                                    on:change={(e) => handleColumnToggle(colItem.column, e.currentTarget.checked)}
                                                    class="sr-only peer"
                                                />

                                                <div 
                                                    role="switch"
                                                    tabindex="0"
                                                    aria-checked={colItem.showColumn}
                                                    aria-labelledby={`column-toggle-label-${colItem.column}`}
                                                    class="relative inline-flex h-[28px] min-h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border border-neon-blue/50 px-[2px] transition-colors focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 focus:ring-offset-space-blue {colItem.showColumn ? 'bg-neon-blue border-neon-blue' : 'bg-space-blue'}"
                                                    on:click={() => {
                                                        const newState = !colItem.showColumn;
                                                        handleColumnToggle(colItem.column, newState);
                                                    }}
                                                    on:keydown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            const newState = !colItem.showColumn;
                                                            handleColumnToggle(colItem.column, newState);
                                                        }
                                                    }}
                                                >
                                                    <span class="pointer-events-none absolute left-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-md transition-transform {colItem.showColumn ? 'translate-x-6 bg-dark-blue' : 'translate-x-0'}"></span>
                                                </div>
                                            </div>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </Popover>
                {:else}
                    {columnName}
                {/if}
            </th>
        {/each}
    </tr>
</thead>
