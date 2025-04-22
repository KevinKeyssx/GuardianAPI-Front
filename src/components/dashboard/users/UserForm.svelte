<script lang="ts">
    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";
    import Switch       from "@/components/inputs/Switch.svelte";

    let email = $state("");
    let avatarSrc = $state("https://res.cloudinary.com/dbgzsikcs/image/upload/v1693855933/smartnewgen/logo/LOGO-07_at2vwp.jpg");
    let fileInput: HTMLInputElement;
    let isLoading = $state(false);
    
    function handleImageSelect() {
        if (fileInput) {
            fileInput.click();
        }
    }
    
    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            const reader = new FileReader();
            
            isLoading = true;
            
            reader.onload = (e) => {
                if (e.target?.result) {
                    avatarSrc = e.target.result as string;
                    // Aquí podrías implementar la lógica para subir la imagen a un servidor
                }
                isLoading = false;
            };
            
            reader.onerror = () => {
                isLoading = false;
                // Aquí podrías manejar errores de lectura del archivo
            };
            
            reader.readAsDataURL(file);
        }
    }
</script>

<form class="space-y-4">
    <div class="relative w-32 mx-auto"> 
        <div class="w-32 h-32 rounded-full mx-auto border-neon-blue border-4 overflow-hidden relative">
            <img
                src={avatarSrc}
                alt="User Avatar"
                class="w-full h-full object-cover"
            />
            {#if isLoading}
            <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div class="w-6 h-6 border-2 border-t-transparent border-neon-blue rounded-full animate-spin"></div>
            </div>
            {/if}
        </div>
        <button 
            class="absolute bottom-1 right-1 bg-neon-blue text-white p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
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

    <Input
        placeholder = "Enter email"
        id          = "email"
        name        = "email"
        disabled    = {true}
        type        = 'text'
        bind:value  = {email}
        label       = "Email"
    />

    <Input
        placeholder = "Enter name"
        id          = "name"
        name        = "name"
        type        = 'text'
        bind:value  = {email}
        label       = "Name"
    />

    <Input
        placeholder = "Enter Nickname"
        id          = "nickname"
        name        = "nickname"
        type        = 'text'
        bind:value  = {email}
        label       = "Nickname"
    />

    <DatePicker label="Birthday" />

    <Input
        placeholder = "Enter Phone"
        id          = "phone"
        name        = "phone"
        type        = 'text'
        bind:value  = {email}
        label       = "Phone"
    />

    <Switch label="Active" />
    <Switch label="Verified" />
</form>

<div class="mt-12 space-y-2">
    <p class="flex items-center px-4 py-2 border border-neon-blue/50 bg-neon-blue/10 text-neon-blue rounded-md justify-between">
        <span class="text-sm font-orbitron font-bold">
            Created:
        </span>
        <span>5h june, 2025 - 00:55</span>
    </p>
    <p class="flex items-center px-4 py-2 border border-neon-blue/50 bg-neon-blue/10 text-neon-blue rounded-md justify-between">
        <span class="text-sm font-orbitron font-bold">
            Updated:
        </span>
        <span>5h june, 2025 - 00:55</span>
    </p>
</div>
