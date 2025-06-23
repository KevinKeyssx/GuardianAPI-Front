<script lang="ts">
    import { AlertDialog } from "bits-ui";
  </script>
   
  <AlertDialog.Root>
    <AlertDialog.Trigger
      class="px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300 flex items-center"
    >
      Subscribe
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay
        class="fixed inset-0 z-50 bg-space-blue/10 backdrop-blur-sm data-[state=open]:animate-overlay-show"
      />
      <AlertDialog.Content
        class="rounded-card-lg bg-dark-blue shadow-popover outline-hidden fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border p-7 sm:max-w-lg md:w-full data-[state=open]:animate-content-show"
      >
        <div class="flex flex-col gap-4 pb-6">
          <AlertDialog.Title class="text-lg font-semibold text-neon-blue">
            Confirm your transaction
          </AlertDialog.Title>
          <AlertDialog.Description class="text-sm text-dark-blue/80">
            This action cannot be undone. This will initiate a monthly wire in the
            amount of $10,000 to Huntabyte. Do you wish to continue?
          </AlertDialog.Description>
        </div>
        <div class="flex w-full items-center justify-center gap-2">
          <AlertDialog.Cancel
            class="px-4 py-2 bg-dark-blue/10 hover:bg-dark-blue/20 text-dark-blue rounded-md transition-colors duration-300 flex items-center"
          >
            Cancel
          </AlertDialog.Cancel>
          <AlertDialog.Action
            class="px-4 py-2 bg-neon-blue text-dark-blue rounded-md hover:bg-opacity-80 transition-colors duration-300 flex items-center"
          >
            Continue
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>