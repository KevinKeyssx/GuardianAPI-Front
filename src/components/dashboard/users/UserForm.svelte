<script lang="ts">
    import DatePicker from "@/components/inputs/DatePicker.svelte";
    import Input from "@/components/inputs/Input.svelte";
    import Select from "@/components/inputs/Select.svelte";
    import Switch from "@/components/inputs/Switch.svelte";
</script>

<div class="space-y-4">
    <!-- <Modal id={id} type="user" /> -->

    <DatePicker />
    <Select />
    <Switch />
    <Input placeholder="Enter name" id="name" name="name" />

    <div class="flex flex-col">
        <label for="name" class="text-sm font-orbitron text-white mb-1">Name</label>
        <input
            type="text"
            name="name"
            placeholder="Enter name"
            id="name"
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none text-white"
            required
        />
    </div>
    <div class="flex flex-col">
        <label for="email" class="text-sm font-orbitron text-white mb-1">Email</label>
        <input
            type="email"
            id="email"
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none text-white"
            required
        />
    </div>
    <div class="flex flex-col">
        <label for="email" class="text-sm font-orbitron text-white mb-1">Email</label>
        <input
            type="email"
            id="email"
            class="w-full px-4 py-2 bg-space-blue border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none text-white"
            required
        />
    </div>
</div>