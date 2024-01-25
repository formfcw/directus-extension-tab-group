import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
    id: "directus-extension-tab-group",
    name: "Tab Group",
    description:
        "A group interface with a tab menu for toggling the visibility of fields within the group.",
    icon: "tab",
    component: InterfaceComponent,
    localTypes: ["group"],
    group: "group",
    types: ["alias"],
    options: ({ field }) => [
        {
            field: "buttons",
            name: "$t:options",
            type: "json",
            meta: {
                interface: "code",
                options: {
                    language: "json",
                    template: JSON.stringify(
                        [
                            {
                                label: "Deutsch",
                                active: true,
                                fields: [
                                    {
                                        name: `${field.field}_de`,
                                        activeWidth: "full",
                                    },
                                ],
                            },
                            {
                                label: "English",
                                fields: [
                                    {
                                        name: `${field.field}_en`,
                                        activeWidth: "full",
                                    },
                                ],
                            },
                        ],
                        null,
                        4
                    ),
                },
            },
        },
        {
            field: "showAllButton",
            name: "All Tab",
            type: "boolean",
            meta: {
                width: "half",
                interface: "boolean",
                options: {
                    label: "Add a tab that shows all fields",
                },
            },
            schema: {
                default_value: true,
            },
        },
        {
            field: "labelAllButton",
            name: "All Tab Label",
            meta: {
                width: "half",
                interface: "system-input-translated-string",
            },
            schema: {
                default_value: "All",
            },
        },
        {
            field: "bulkApplyButton",
            name: "Bulk Apply Button",
            type: "boolean",
            meta: {
                width: "full",
                interface: "boolean",
                options: {
                    label: "Add a button to apply tab changes to other tab groups",
                },
            },
            schema: {
                default_value: true,
            },
        },
        {
            field: "bulkApplyKey",
            name: "Bulk Apply Key",
            meta: {
                width: "half",
                interface: "input",
                note: "The button only applies to groups with the same “Bulk Apply Key”.",
            },
            schema: {
                default_value: "default",
            },
        },
        {
            field: "bulkApplyTooltip",
            name: "Bulk Apply Button Tooltip",
            meta: {
                width: "half",
                interface: "system-input-translated-string",
            },
            schema: {
                default_value: "Apply To All",
            },
        },
    ],
    preview: `<svg width="156" height="96" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M131 14H25a6 6 0 0 0-6 6v56a6 6 0 0 0 6 6h106a6 6 0 0 0 6-6V20a6 6 0 0 0-6-6Z" stroke="var(--theme--primary, var(--primary))" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 6"/><path d="M56 39H40a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2ZM100 39H64a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h36a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z" fill="var(--theme--primary, var(--primary))" fill-opacity=".25"/><rect x="29" y="34" width="98" height="16" rx="5" stroke="var(--theme--primary, var(--primary))" stroke-width="2"/><path d="M56 61H40a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2ZM100 61H64a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h36a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z" fill="var(--theme--primary, var(--primary))" fill-opacity=".25"/><rect x="29" y="56" width="98" height="16" rx="5" stroke="var(--theme--primary, var(--primary))" stroke-opacity=".25" stroke-width="2"/><rect x="29" y="23" width="16" height="6" rx="2" fill="var(--theme--primary, var(--primary))"/><rect x="49" y="23" width="20" height="6" rx="2" fill="var(--theme--primary, var(--primary))" fill-opacity=".25"/><rect x="73" y="23" width="10" height="6" rx="2" fill="var(--theme--primary, var(--primary))" fill-opacity=".25"/></svg>`,
});
