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
            class="mr-3 w-56 z-40 rounded-md py-3 px-3 bg-dark-blue/50 backdrop-blur-md border border-neon-blue/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            sideOffset={8}
        >
            <slot />
        </Popover.Content>
    </Popover.Portal>
</Popover.Root>
