<script lang="ts">
    import { Switch } from "bits-ui";
    import { onMount } from 'svelte';
    
    export let columnName: string;
    export let isVisible: boolean = true;
    
    // Cargar el estado inicial desde localStorage
    onMount(() => {
        try {
            const visibleColumns = JSON.parse(localStorage.getItem('visibleColumns') || '{}');
            if (columnName in visibleColumns) {
                isVisible = visibleColumns[columnName];
            }
        } catch (error) {
            console.error('Error loading column visibility state:', error);
        }
    });
    
    function handleToggle(checked: boolean) {
        isVisible = checked;
        
        // Actualizar localStorage directamente
        try {
            const visibleColumns = JSON.parse(localStorage.getItem('visibleColumns') || '{}');
            visibleColumns[columnName] = checked;
            localStorage.setItem('visibleColumns', JSON.stringify(visibleColumns));
        } catch (error) {
            console.error('Error saving column visibility state:', error);
        }
        
        // Emitir un evento personalizado que será capturado por el script en TableHead
        const event = new CustomEvent('columnToggle', {
            detail: {
                columnName,
                isVisible: checked
            },
            bubbles: true
        });
        
        document.dispatchEvent(event);
    }
</script>

<div class="flex items-center justify-between py-2">
    <label for={`column-toggle-${columnName}`} class="text-sm font-orbitron text-white">{columnName}</label>

    <Switch.Root
        id={`column-toggle-${columnName}`}
        name={`column-toggle-${columnName}`}
        checked={isVisible}
        onCheckedChange={handleToggle}
        class="focus-visible:ring-neon-blue focus-visible:ring-offset-space-blue data-[state=checked]:bg-neon-blue data-[state=unchecked]:bg-space-blue data-[state=unchecked]:border-neon-blue/50 focus-visible:outline-none peer inline-flex h-[28px] min-h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full border border-neon-blue/50 px-[2px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
        <Switch.Thumb
            class="bg-white data-[state=checked]:bg-dark-blue pointer-events-none block size-[22px] shrink-0 rounded-full shadow-md transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
        />
    </Switch.Root>
</div>
