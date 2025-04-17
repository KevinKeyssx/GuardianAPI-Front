<script lang="ts">
    export let onClick: () => void;
</script>

<button
    class       = "neon_button hover:scale-105 rounded-lg font-semibold flex items-center gap-2 justify-center"
    on:click    = { onClick }
>
    <slot/>
</button>
