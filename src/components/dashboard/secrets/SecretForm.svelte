<script lang="ts">
    import DatePickerP from "@/components/inputs/DatePickerP.svelte";

    import Input        from "@/components/inputs/Input.svelte";
    import Dialog       from "@/components/shared/dialog/dialog.svelte";
    import DateForm     from "@/components/shared/show/date-form.svelte";
    import type { Secret } from "@/lib/graphql/secrets/types";

    import { CalendarDateTime, type DateValue } from "@internationalized/date";

    interface Props {
        secret      : Secret;
        clicked     : number;
        onSuccess?  : () => void;
    }


    const {
        secret: secretData,
        clicked = $bindable(),
        onSuccess
    }: Props = $props();


    let secret = $state<Secret>(secretData);

        function getMaxDate(): DateValue {
        const date = new Date();
        return new CalendarDateTime( date.getFullYear(), date.getMonth() + 1, date.getDate() );
    }

</script>

<form class="space-y-4" id="secret-form">

    <Input
        bind:value  = { secret.name }
        label       = "Name"
        placeholder = "Enter name"
        id          = "name"
        name        = "name"
        type        = 'text'
    />

    <DatePickerP
        bind:value={ secret.willExpireAt }
        id      = "will-expire-at"
        label   = "Will expire at"
        minDate = {new Date()}
    /> 

    <!-- <DateForm
        id            = "will-expire-at"
        label         = "Will expire at"
    /> -->
</form>
