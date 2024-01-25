# Tab Group Interface for Directus

[![NPM version](https://img.shields.io/npm/v/directus-extension-tab-group)](https://www.npmjs.com/package/directus-extension-tab-group)

A group interface with a tab menu for toggling the visibility of fields within the group.

```sh
# Install via npm
npm install directus-extension-tab-group
# Install via yarn
yarn add directus-extension-tab-group
# Install via pnpm
pnpm add directus-extension-tab-group
```

## Use case

The main use case for this extension is to provide an alternative solution to the translation interface. You can use this tab group interface to toggle fields individually or some of them or all of them together as you like. For example, you can toggle the visibility of a `title_de` and a `title_en` field. In addition you can apply tab changes to other tab groups by using the `Bulk Apply Button`.

<!-- INSERT VIDEO HERE -->

## Options

In your interface settings, you can use a JSON field to specify which button displays which fields, like:

```json
[
    {
        "label": "Deutsch",
        "active": true,
        "fields": [
            {
                "name": "title_de",
                "activeWidth": "full"
            }
        ]
    },
    {
        "label": "English",
        "fields": [
            {
                "name": "title_en",
                "activeWidth": "full"
            }
        ]
    },
    {
        "label": "Deutsch + English",
        "fields": [
            {
                "name": "title_de",
                "activeWidth": "half"
            },
            {
                "name": "title_en",
                "activeWidth": "half"
            }
        ]
    }
]
```

There are also options to add an `All` tab to display all fields as specified and to add a `Bulk Apply Button` to other tab groups (using the same `Bulk Apply Key`).

![](docs/settings.png)

---

## Overwriting styles

Use the following classes to customize CSS styles via the Directus Project Settings: `.tab-group`, `.tab-group .menu` or `.tab-group .menu .menu-item`.

Example:

```CSS
/* disable the vertical bar */
.tab-group::before {
	content: none !important;
}
```
