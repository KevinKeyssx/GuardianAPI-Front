<script lang="ts">
    import DatePicker   from "@/components/inputs/DatePicker.svelte";
    import Input        from "@/components/inputs/Input.svelte";
    import Dialog       from "@/components/shared/dialog/dialog.svelte";
    import DateForm     from "@/components/shared/show/date-form.svelte";

    interface Secret {
        name: string;
        willExpireAt: string;
    }

    interface Props {
        id: string;
        secret?: Secret;
    }

    const { id, secret } = $props();
</script>

<form class="space-y-4" {id}>
    <Input
        bind:value  = { secret.name }
        label       = "Name"
        placeholder = "Enter name"
        id          = "name"
        name        = "name"
        type        = 'text'
    />

    <DatePicker
        bind:value    = { secret.willExpireAt }
        id            = "will-expire-at"
        label         = "Will expire at"
    />

    <!-- <DateForm
        id            = "will-expire-at"
        label         = "Will expire at"
    /> -->
</form>
