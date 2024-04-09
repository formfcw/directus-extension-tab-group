<template>
    <div class="tab-group">
        <div class="menu">
            <v-button
                v-for="item in buttons"
                @click="selectTab(item)"
                xSmall
                secondary
                :active="item.active"
                class="menu-item"
            >{{ item.label }}</v-button>
            <v-button
                v-if="showBulkApplyButton"
                xSmall
                secondary
                class="menu-item menu-item-icon"
                :tooltip="bulkApplyTooltip"
                @click="bulkApplyStore?.setItem(activeTab!)"
            >
                <v-icon
                    name="magic_button"
                    xSmall
                />
            </v-button>
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
    import { onMounted, onUnmounted, ref, reactive, computed, watch } from 'vue';
    import { useStorage } from '@vueuse/core'

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
            bulkApplyButton?: boolean;
            bulkApplyKey?: string;
            bulkApplyTooltip?: string;
        }>(),
        {
            batchActiveFields: () => [],
            validationErrors: () => [],
            showAllButton: true,
            labelAllButton: 'All',
            bulkApplyButton: true,
            bulkApplyKey: 'default',
            bulkApplyTooltip: 'Apply To All',
        }
    );

    defineEmits(['apply']);


    const { fields, resetFieldToDefaults } = useFieldsDefault();

    const { buttons, activeTab, selectTab } = useTabs();

    const bulkApplyStore = useBulkApplyButton();
    const showBulkApplyButton = computed(
        () => bulkApplyStore !== null && activeTab.value?.label != bulkApplyStore?.getState()
    );

    onMounted(() => {
        selectTab(initialSelection());

        function initialSelection(): Button {
            const activeButtonByStore = bulkApplyStore?.getSelectableItem();
            if (activeButtonByStore) return activeButtonByStore;

            return activeTab.value ?? buttons[0] as Button;
        }
    });


    function useBulkApplyButton() {
        if (!props.bulkApplyButton) return null;

        const state = useStorage(`tab-group-bulk-apply-${props.bulkApplyKey}`, null as null | string);

        watch(state, () => {
            const buttonToSelect = getSelectableItem();
            if (!buttonToSelect) return;

            selectTab(buttonToSelect);
        });

        return {
            setItem: (activeButton: Button) => { state.value = activeButton.label },
            getState: () => state.value,
            getSelectableItem,
        }

        function getSelectableItem() {
            return buttons.find((item) => item.label == state.value);
        }
    }


    function useTabs() {
        const buttons = reactive(props.buttons || []);

        if (props.showAllButton) {
            buttons.push({
                label: props.labelAllButton,
                fields: "*"
            } as Button);
        }

        const activeTab = computed<Button | undefined>(() => buttons.find((item) => item.active));

        return {
            buttons,
            activeTab,
            selectTab(button: Button) {
                fields.value.map(item => {
                    if (button.fields == '*') {
                        resetFieldToDefaults(item);
                        return item;
                    }

                    const selectedField = button.fields.find(({ name }) => name === item.field);
                    item.meta!.hidden = !selectedField;
                    item.meta!.width = selectedField?.activeWidth ?? 'full';

                    return item;
                });

                buttons.map(item => {
                    item.active = button == item;
                    return item;
                });
            }
        }
    }


    function useFieldsDefault() {
        const fieldsDefault = ref<Record<string, any>>({});
        const fields = ref(props.fields || []);
        watch(() => props.fields, updateFieldsReadonlyProp);
        onMounted(() => fieldsDefault.value = storeFieldsDefault());
        onUnmounted(() => fields.value.map(item => resetFieldToDefaults(item)));

        return {
            fields,
            resetFieldToDefaults,
        };

        function updateFieldsReadonlyProp(updatedFields: Record<string, any>[]) {
            fields.value = fields.value.map(item => {
                const updated = updatedFields.find((updated) => updated.field == item.field);
                if (updated)
                    item.meta!.readonly = updated.meta!.readonly;
                return item;
            })
        }

        function resetFieldToDefaults(item: any) {
            item.meta!.hidden = fieldsDefault.value[item.field].hidden ?? false;
            item.meta!.width = fieldsDefault.value[item.field].width ?? 'full';
        }

        function storeFieldsDefault() {
            const values: Record<string, { hidden: boolean; width: string }> = {};
            fields.value.forEach(item => {
                values[item.field] = {
                    hidden: item.meta?.hidden ?? false,
                    width: item.meta?.width ?? 'full',
                };
            });
            return values;
        }
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
        vertical-align: top;
    }

    .menu-item:not(:first-child) {
        margin-left: 2px;
    }

    .menu-item :deep(.button) {
        --v-button-height: 1.5em;
        --v-button-min-width: 3em;
        padding: 0.5em;
    }

    .menu-item.menu-item-icon :deep(.button) {
        /* --v-button-height: 1.5em; */
        --v-button-min-width: 1.5em;
        padding: 0;
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