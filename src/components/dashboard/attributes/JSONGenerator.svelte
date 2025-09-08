<script lang="ts">
    import Input    from '@/components/inputs/Input.svelte';
    import Select   from '@/components/inputs/Select.svelte';
    import Switch   from '@/components/inputs/Switch.svelte';

    import CreateIcon from '@/icons/CreateIcon.svelte';
    import DeleteIcon from '@/icons/DeleteIcon.svelte';


    type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array';

    type Props = {
        value?: string;
    };

    let { value = $bindable('{}') }: Props = $props();


    const options = [
        { label: 'String',  value: 'string' },
        { label: 'Number',  value: 'number' },
        { label: 'Boolean', value: 'boolean' },
    ];


    const optionsObject = [
        ...options,
        { label: 'Object',  value: 'object' },
    ]


    const optionsArray = [
        ...optionsObject,
        { label: 'Array',   value: 'array' }
    ]


    interface JsonField {
        id          : string;
        key         : string;
        type        : FieldType;
        value       : any;
        children?   : JsonField[];
    }


    let fields      = $state<JsonField[]>( [] );
    let jsonOutput  = $state( '{}' );
    let copySuccess = $state( false );
    let initialized = $state( false );


    const generateId    = (): string => Math.random().toString( 36 ).substring( 2, 9 );
    const newFieldEmpty = {
        key         : '',
        type        : 'string' as FieldType,
        value       : '',
        children    : [] as JsonField[]
    }


    function addField( parentFields: JsonField[] = fields, parentPath: string = '' ): void {
        const newField: JsonField = {
            ...newFieldEmpty,
            id: generateId(),
        };

        parentFields.push( newField );
        updateJsonOutput();
    }


    function removeField( fieldId: string, parentFields: JsonField[] = fields ): void {
        const index = parentFields.findIndex( f => f.id === fieldId );

        if ( index !== -1 ) {
            parentFields.splice( index, 1 );
            updateJsonOutput();
            return;
        }

        for ( const field of parentFields ) {
            if ( field.children ) {
                removeField( fieldId, field.children );
            }
        }
    }


    function addChildField( parentField: JsonField ): void {
        if ( !parentField.children ) {
            parentField.children = [];
        }

        const newField: JsonField = {
            ...newFieldEmpty,
            id: generateId(),
        };

        parentField.children.push( newField );
        updateJsonOutput();
    }


    function updateFieldType( field: JsonField, newType: FieldType ): void {
        field.type = newType;

        field.value  = {
            string  : '',
            number  : 0,
            boolean : false,
            object  : {},
            array   : [],
        }[newType];

        if ( newType === 'object' || newType === 'array' ) {
            field.children = [];
        }

        updateJsonOutput();
    }


    function getArrayItem( field: JsonField ): any {
        if ( field.children && field.children.length > 0 ) {
            return field.children.map( child => {
                if ( child.type === 'object' ) {
                    return child.children ? buildJsonFromFields( child.children ) : {};
                }

                return child.value;
            });
        } 

        return [];
    }


    function buildJsonFromFields( fields: JsonField[] ): any {
        const result: any = {};

        for ( const field of fields ) {
            if ( !field.key.trim() ) continue;

            result[field.key] = {
                string  : field.value || '',
                number  : Number( field.value ) || 0,
                boolean : Boolean( field.value ),
                object  : field.children ? buildJsonFromFields( field.children ) : {},
                array   : getArrayItem( field )
            }[ field.type ];
        }

        return result;
    }


    function updateJsonOutput(): void {
        try {
            const jsonObj = buildJsonFromFields( fields );
            jsonOutput = JSON.stringify( jsonObj, null, 2 );
            value = jsonOutput;
        } catch (error) {
            jsonOutput = '{ "error": "Invalid JSON structure" }';
            value = jsonOutput;
        }
    }


    async function copyToClipboard(): Promise<void> {
        try {
            await navigator.clipboard.writeText( jsonOutput );

            copySuccess = true;

            setTimeout( () => copySuccess = false, 2000 );
        } catch (err) {
            console.error( 'Failed to copy: ', err );
        }
    }


    function downloadJson(): void {
        const blob  = new Blob([jsonOutput], { type: 'application/json' });
        const url   = URL.createObjectURL( blob );
        const a     = document.createElement( 'a' );

        a.href      = url;
        a.download  = 'generated.json';

        document.body.appendChild( a );

        a.click();

        document.body.removeChild( a );

        URL.revokeObjectURL( url );
    }


    function clearAll(): void {
        fields.length = 0;
        updateJsonOutput();
    }


    // Initialize fields from existing JSON value
    function initializeFromJson( jsonString: string ): void {
        if ( !jsonString || jsonString === '{}' ) {
            fields = [];
            return;
        }

        try {
            const parsed = JSON.parse( jsonString );
            fields = convertObjectToFields( parsed );
        } catch ( error ) {
            console.error( 'Error parsing initial JSON:', error );
            fields = [];
        }
    }


    // Convert parsed JSON object to JsonField array
    function convertObjectToFields( obj: any, parentKey: string = '' ): JsonField[] {
        const result: JsonField[] = [];

        for ( const [key, val] of Object.entries( obj ) ) {
            const field: JsonField = {
                id      : generateId(),
                key     : key,
                type    : getFieldType( val ),
                value   : val,
                children: []
            };

            if ( field.type === 'object' && val && typeof val === 'object' && !Array.isArray( val ) ) {
                field.children = convertObjectToFields( val, key );
                field.value = {};
            } else if ( field.type === 'array' && Array.isArray( val ) ) {
                field.children = val.map( ( item, index ) => ({
                    id      : generateId(),
                    key     : index.toString(),
                    type    : getFieldType( item ),
                    value   : item,
                    children: item && typeof item === 'object' && !Array.isArray( item ) 
                        ? convertObjectToFields( item, `${key}[${index}]` ) 
                        : []
                }));
                field.value = [];
            }

            result.push( field );
        }

        return result;
    }


    // Get field type from value
    function getFieldType( val: any ): FieldType {
        if ( val === null || val === undefined ) return 'string';
        if ( typeof val === 'string' ) return 'string';
        if ( typeof val === 'number' ) return 'number';
        if ( typeof val === 'boolean' ) return 'boolean';
        if ( Array.isArray( val ) ) return 'array';
        if ( typeof val === 'object' ) return 'object';
        return 'string';
    }


    $effect(() => {
        if ( !initialized && value && value !== '{}' ) {
            initializeFromJson( value );
            initialized = true;
        } else if ( !initialized ) {
            initialized = true;
        }
        updateJsonOutput();
    });
</script>

<div class="grid grid-cols-1 gap-6">
    <div class="">
        <div class="flex gap-2 mb-5 items-center justify-end">
            <button
                onclick = { () => addField() }
                type    = "button"
                class   = "flex text-sm items-center gap-2 px-4 py-2 bg-neon-blue text-dark-blue rounded-lg hover:bg-neon-blue/80 transition-colors font-orbitron"
            >
                <CreateIcon />

                Add Field
            </button>

            <button
                type    = "button"
                onclick = { clearAll }
                class   = "flex text-sm items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-orbitron"
            >
                <svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="32" stroke-dashoffset="32" d="M12 6c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6v-2.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="32;0"/></path><path stroke-dasharray="6" stroke-dashoffset="6" d="M6 9l-3 3M6 9l3 3"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="6;0"/></path></g></svg>
                Clear All
            </button>
        </div>

        <div class="mt-4 space-y-4 max-h-96 overflow-y-auto">
            {#each fields as field, index (field.id)}
                <div class="border border-neon-blue/30 rounded-lg p-4 bg-space-blue/30">
                    <div class="flex items-center gap-2 mb-3">
                        <Input
                            bind:value  = { field.key }
                            onInput     = { updateJsonOutput }
                            placeholder = "Nombre del campo"
                            type        = "text"
                        />

                        <Select
                            id          = { `i-${index}` }
                            bind:value  = { field.type }
                            onChange    = {( value ) => updateFieldType( field, value as FieldType )}
                            options     = { optionsArray }
                        />

                        <button
                            type    = "button"
                            onclick = {() => removeField( field.id )}
                            class   = "p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                        >
                            <DeleteIcon />
                        </button>
                    </div>

                    <!-- Value Input -->
                    {#if field.type === 'string'}
                        <Input
                            bind:value  = { field.value }
                            onInput     = { updateJsonOutput }
                            placeholder = "Valor del string"
                            type        = "text"
                        />
                    {:else if field.type === 'number'}
                        <Input
                            bind:value  = { field.value }
                            onInput     = { updateJsonOutput }
                            placeholder = "Valor numérico"
                            type        = "number"
                        />
                    {:else if field.type === 'boolean'}
                        <Switch
                            bind:checked = { field.value }
                            onChange     = { updateJsonOutput }
                            label        = { field.value ? 'true' : 'false' }
                        />
                    {:else if field.type === 'object' || field.type === 'array'}
                        <div class="ml-4 border-l-2 border-neon-blue/30 pl-4">
                            <button
                                type    = "button"
                                onclick = {() => addChildField( field )}
                                class   = "flex items-center gap-2 px-3 py-1 text-sm bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors mb-2 font-orbitron"
                            >
                                <CreateIcon />

                                Add {field.type === 'object' ? 'Property' : 'Element'}
                            </button>

                            {#if field.children}
                                {#each field.children as child, index ( child.id )}
                                    <div class="mb-2 p-2 bg-space-blue/50 rounded border border-neon-blue/20">
                                        <div class="flex items-center gap-2 mb-2">
                                            {#if field.type === 'object'}
                                                <Input
                                                    bind:value  = { child.key }
                                                    onInput     = { updateJsonOutput }
                                                    placeholder = "Key"
                                                    type        = "text"
                                                />
                                            {/if}

                                            <Select
                                                id          = {`item-${index}`}
                                                bind:value  = { child.type }
                                                onChange    = {( value ) => updateFieldType( child, value as FieldType )}
                                                options     = { optionsObject }
                                            />

                                            <button
                                                type    = "button"
                                                onclick = {() => removeField( child.id, field.children )}
                                                class   = "p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                            >
                                                <DeleteIcon/>
                                            </button>
                                        </div>

                                        {#if child.type === 'string'}
                                            <Input
                                                bind:value  = { child.value }
                                                onInput     = { updateJsonOutput }
                                                placeholder = "Valor"
                                                type        = "text"
                                            />
                                        {:else if child.type === 'number'}
                                            <Input
                                                bind:value  = { child.value }
                                                onInput     = { updateJsonOutput }
                                                placeholder = "Valor"
                                                type        = "number"
                                            />
                                        {:else if child.type === 'boolean'}
                                            <Switch
                                                bind:checked = { child.value }
                                                onChange     = { updateJsonOutput }
                                                label        = { child.value ? 'true' : 'false' }
                                            />
                                        {:else if child.type === 'object'}
                                            <div class="ml-4 border-l-2 border-neon-blue/30 pl-4">
                                                <button
                                                    type    = "button"
                                                    onclick = {() => addChildField( child )}
                                                    class   = "flex items-center gap-2 px-3 py-1 text-sm bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors mb-2 font-orbitron"
                                                >
                                                    <CreateIcon />
                                                    Add Property
                                                </button>

                                                {#if child.children}
                                                    {#each child.children as nestedChild, index ( nestedChild.id ) }
                                                        <div class="mb-2 p-2 bg-space-blue/70 rounded border border-neon-blue/20">
                                                            <div class="flex items-center gap-2 mb-2">
                                                                <Input
                                                                    bind:value  = { nestedChild.key }
                                                                    onInput     = { updateJsonOutput }
                                                                    placeholder = "Key"
                                                                    type        = "text"
                                                                />

                                                                <Select
                                                                    id          = {`object-${index}-${nestedChild.id}`}
                                                                    bind:value  = { nestedChild.type }
                                                                    onChange    = {( value ) => updateFieldType( nestedChild, value as FieldType )}
                                                                    { options }
                                                                />

                                                                <button
                                                                    type    = "button"
                                                                    onclick = {() => removeField( nestedChild.id, child.children )}
                                                                    class   = "p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                                >
                                                                    <DeleteIcon/>
                                                                </button>
                                                            </div>

                                                            {#if nestedChild.type === 'string'}
                                                                <Input
                                                                    bind:value  = { nestedChild.value }
                                                                    onInput     = { updateJsonOutput }
                                                                    placeholder = "Valor"
                                                                    type        = "text"
                                                                />
                                                            {:else if nestedChild.type === 'number'}
                                                                <Input
                                                                    bind:value  = { nestedChild.value }
                                                                    onInput     = { updateJsonOutput }
                                                                    placeholder = "Valor"
                                                                    type        = "number"
                                                                />
                                                            {:else if nestedChild.type === 'boolean'}
                                                                <Switch
                                                                    bind:checked = { nestedChild.value }
                                                                    onChange     = { updateJsonOutput }
                                                                    label        = { nestedChild.value ? 'true' : 'false' }
                                                                />
                                                            {/if}
                                                        </div>
                                                    {/each}
                                                {/if}
                                            </div>
                                        {/if}
                                    </div>
                                {/each}
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}

            {#if fields.length === 0}
                <div class="text-center py-12 text-white/60">
                <p class="text-lg mb-2 font-orbitron">There are no added fields</p>
                <p class="text-sm">Click "Add Field" to start</p>
                </div>
            {/if}
        </div>
    </div>

    <!-- Preview Panel -->
    <div class="space-y-2">
        <h3>Preview</h3>
        <div class="bg-dark-blue rounded-lg p-4 h-96 overflow-auto border border-neon-blue/20 relative">
            <div class="absolute top-2 right-2 flex items-center gap-1 z-10">
                <button
                    type        = "button"
                    onclick     = { copyToClipboard }
                    class       = "p-1 bg-neon-blue/20 hover:brightness-105 text-white rounded-lg transition-colors backdrop-blur-sm"
                    aria-label  = "Copy JSON"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="72" stroke-dashoffset="72" d="M12 3h7v18h-14v-18h7Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" stroke-width="1" d="M14.5 3.5v3h-5v-3"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="12;0"/></path><path stroke-dasharray="10" stroke-dashoffset="10" d="M9 13l2 2l4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="10;0"/></path></g></svg>
                </button>

                <button
                    type        = "button"
                    onclick     = { downloadJson }
                    class       = "p-1 bg-neon-blue/20 hover:brightness-105 text-white rounded-lg transition-colors backdrop-blur-sm"
                    aria-label  = "Download JSON"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="20" stroke-dashoffset="20" d="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5"><animate attributeName="d" begin="0.5s" dur="1.5s" repeatCount="indefinite" values="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5;M12 4h2v3h2.5l-4.5 4.5M12 4h-2v3h-2.5l4.5 4.5;M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5"/><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="14;0"/></path></g></svg>
                </button>
            </div>
            
            <pre class="text-neon-blue text-sm font-mono whitespace-pre-wrap">{jsonOutput}</pre>
        </div>

        <div class="mt-4 p-3 bg-space-blue/30 rounded-lg border border-neon-blue/20">
            <div class="text-sm text-white/80 font-orbitron flex justify-between">
                <span>

                    <strong>Caracters:</strong> { jsonOutput.length }
                </span>
                <span>

                    <strong>Lines:</strong> { jsonOutput.split('\n').length }
                </span>
            </div>
        </div>
    </div>
</div>
