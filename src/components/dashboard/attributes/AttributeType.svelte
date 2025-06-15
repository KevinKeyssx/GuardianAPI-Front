<script lang="ts">
    export let type: string;

    const typeStyles = {
        STRING  : 'bg-green-900/30 text-green-300',
        OBJECT  : 'bg-blue-900/30 text-blue-300',
        DEFAULT : 'bg-purple-900/30 text-purple-300',
        NUMBER  : 'bg-cyan-900/30 text-cyan-300',
        BOOLEAN : 'bg-yellow-900/30 text-yellow-300',
        DATE    : 'bg-pink-900/30 text-pink-300',
        DECIMAL : 'bg-orange-900/30 text-orange-300',
    };

    const typeClass = typeStyles[type as keyof typeof typeStyles] || typeStyles.DEFAULT;
</script>

<span class={`px-2 py-1 text-xs rounded-full ${typeClass}`}>
    {type}
</span>
