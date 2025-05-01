<script lang="ts">
	import { Popover } from "bits-ui";

    import configIcon from '@/assets/icons/config.svg?raw';
</script>

<Popover.Root>
	<Popover.Trigger
        class="text-neon-blue hover:bg-neon-blue/20 rounded-full"
    >
        {@html configIcon}
    </Popover.Trigger>

    <Popover.Portal>
        <Popover.Content
            class="dropdown-content z-50 w-56 rounded-md shadow-lg bg-dark-blue border border-neon-blue/30 py-3 px-3"
            sideOffset={8}
        >
            <slot />
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>
