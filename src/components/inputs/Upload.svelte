<script lang="ts">
    import userIcon from '../../assets/icons/user.svg?url';
    
    type Props = { avatar?: string };

    let { avatar = $bindable() }: Props = $props();

    let isLoading = $state( false );
    let fileInput: HTMLInputElement;


    function handleImageSelect(): void {
        if ( fileInput ) fileInput.click();
    }


    function handleFileChange( event: Event ): void {
        const target = event.target as HTMLInputElement;

        if ( !target.files || !target.files[0] ) return;

        const file: File = target.files[0];
        const reader = new FileReader();

        isLoading = true;

        reader.onload = ( e: ProgressEvent<FileReader> ) => {
            if ( e.target?.result ) {
                avatar = e.target.result as string;
                // Aquí podrías implementar la lógica para subir la imagen a un servidor
            }

            isLoading = false;
        };

        reader.onerror = ( e: ProgressEvent<FileReader> ) => {
            isLoading = false;
            // Aquí podrías manejar errores de lectura del archivo
        };

        reader.readAsDataURL( file );
    }
</script>

<div class="relative w-32 mx-auto"> 
    <div class="w-32 h-32 rounded-full mx-auto border-neon-blue border-4 overflow-hidden relative">
        <img
            src     = { avatar || userIcon }
            alt     = "User Avatar"
            class   = "w-full h-full p-5 object-cover"
        />

        {#if isLoading}
            <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div class="w-6 h-6 border-2 border-t-transparent border-neon-blue rounded-full animate-spin"></div>
            </div>
        {/if}
    </div>

    <button 
        class="absolute bottom-1 right-1 bg-neon-blue text-dark-blue p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-white"
        type="button"
        onclick={handleImageSelect}
        aria-label="Edit profile picture"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </button>

    <input 
        type="file" 
        accept="image/*" 
        class="hidden" 
        bind:this={fileInput} 
        onchange={handleFileChange}
    />
</div>
