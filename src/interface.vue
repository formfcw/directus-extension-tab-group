<template>
    <div class="tab-group">
        <div class="menu">
            <v-button
                v-for="item in buttons"
                @click="showField(item)"
                xSmall
                secondary
                :active="item.active"
                class="menu-item"
            >{{ item.label }}</v-button>
        </div>
        <v-form
            :initial-values="initialValues"
            :fields="fields"
            :model-value="values"
            :primary-key="primaryKey"
            :group="field.meta?.field"
            :validation-errors="validationErrors"
            :loading="loading"
            :disabled="disabled"
            :badge="badge"
            :raw-editor-enabled="rawEditorEnabled"
            :direction="direction"
            :show-no-visible-fields="false"
            :show-validation-errors="false"
            @update:model-value="$emit('apply', $event)"
        />
    </div>
</template>



<script setup lang="ts">
    import { Field, ValidationError } from '@directus/types';
    import { onMounted, onUnmounted, ref } from 'vue';

    type ButtonField = {
        name: string;
        activeWidth: "half" | "full";
    };

    type Button = {
        label: string;
        active?: boolean;
        fields: "*" | ButtonField[];
    };

    const props = withDefaults(
        defineProps<{
            field: Field;
            fields: Field[];
            values: Record<string, unknown>;
            initialValues: Record<string, unknown>;
            primaryKey: number | string;
            disabled?: boolean;
            batchMode?: boolean;
            batchActiveFields?: string[];
            loading?: boolean;
            validationErrors?: ValidationError[];
            badge?: string;
            rawEditorEnabled?: boolean;
            direction?: string;
            buttons?: Button[];
            showAllButton?: boolean;
            labelAllButton?: string;
        }>(),
        {
            batchActiveFields: () => [],
            validationErrors: () => [],
            showAllButton: true,
            labelAllButton: 'All',
        }
    );

    defineEmits(['apply']);

    const fieldsDefault = ref({});

    const buttons = ref(props.buttons || []);
    const fields = ref(props.fields || []);

    if (props.showAllButton) {
        buttons.value.push({
            label: props.labelAllButton,
            fields: "*"
        } as Button);
    }


    onMounted(() => {
        fieldsDefault.value = _storeFieldsDefault();
        const activeButton = _setActiveButton();
        showField(activeButton);
    });

    onUnmounted(() => {
        fields.value.map(item => _resetFieldToDefaults(item));
    });


    function showField(button: Button) {
        fields.value.map(item => {
            if (button.fields == '*') {
                _resetFieldToDefaults(item);
                return item;
            }

            const selectedField = button.fields.find(({ name }) => name === item.field);
            item.meta!.hidden = !selectedField;
            item.meta!.width = selectedField?.activeWidth ?? 'full';

            return item;
        });

        buttons.value.map(item => {
            item.active = button == item;
            return item;
        });
    }

    function _resetFieldToDefaults(item) {
        item.meta!.hidden = fieldsDefault.value[item.field].hidden ?? false;
        item.meta!.width = fieldsDefault.value[item.field].width ?? 'full';
    }

    function _storeFieldsDefault() {
        const values = {};
        fields.value.forEach(item => {
            values[item.field] = {
                hidden: item.meta?.hidden ?? false,
                width: item.meta?.width ?? 'full',
            };
        });
        return values;
    }

    function _setActiveButton(): Button {
        let activeItem = buttons.value.find((item) => item.active);

        if (!activeItem) {
            buttons.value[0].active = true;
            activeItem = buttons.value[0];
        }

        return activeItem;
    }
</script>



<style scoped>
    .tab-group {
        position: relative;
    }

    .tab-group:before {
        content: "";
        position: absolute;
        top: 0;
        left: calc(var(--content-padding) / 2 * -1);
        display: block;
        width: var(--theme--border-width, var(--border-width));
        height: 100%;
        background-color: var(--theme--background-normal, var(--background-normal));
    }

    .tab-group:hover:before {
        background-color: var(--theme--border-color, var(--border-normal));
    }

    .menu {
        margin-bottom: 8px;
        line-height: 0;
    }

    .menu-item {
        --theme--border-radius: 4px;
    }

    .menu-item:not(:first-child) {
        margin-left: 2px;
    }

    .menu-item :deep(.button) {
        --v-button-height: 1.5em;
        --v-button-min-width: 3em;
        padding: 0.5em;
    }

    .menu-item :deep(.button:focus-visible) {
        outline: 1px solid var(--theme--primary, var(--primary));
    }

    .menu-item :deep(.button.active) {
        --v-button-color-active: var(--theme--foreground, var(--foreground-normal));
        --v-button-background-color-active: var(--theme--border-color-accent, var(--border-normal));
    }

    .tab-group:hover .menu-item :deep(.button.active) {
        --v-button-color-active: var(--foreground-inverted);
        --v-button-background-color-active: var(--theme--primary, var(--primary));
    }
</style>