<script lang="ts">
    import Modal from "@/components/shared/Modal.svelte";

    type Role = {
        name: string;
        description: string;
        permissions: string[];
    };

    let role: Role = $props();

    // export interface Props {
    //     id: string;
    //     role?: Role;
    // }

    // const { id, role } = Astro.props;
</script>


<div class="space-y-4">

    <!-- {role && (
        <Modal id={id} type="role" />
    )} -->

    <div class="flex flex-col">
        <label
            for="name"
            class="text-sm font-orbitron text-white mb-1"
        >
            Name
        </label>

        <input
            type="text"
            name="name"
            placeholder="Enter role name"
            id="name"
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none text-white"
            required
            value={role?.name}
        />
    </div>

    <div class="flex flex-col">
        <label for="type" class="text-sm font-orbitron text-white mb-1">Type</label>
        <div class="relative">
            <select 
                id="type" 
                class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none text-white appearance-none"
                required
            >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg class="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        </div>
    </div>


    <!-- <div class="flex flex-col">
        <label
            for="description"
            class="text-sm font-orbitron text-white mb-1"
        >
            Description
        </label>

        <textarea
            id="description"
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none text-white"
            rows="3"
            required
            value={role?.description}
        ></textarea>
    </div> -->
</div>