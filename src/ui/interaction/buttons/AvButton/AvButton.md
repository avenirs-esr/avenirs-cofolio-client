# Buttons - `AvButton`

## 🌟 Introduction

The `AvButton` is a component implementing the VueDSFR `DsfrButton`. The button is an interaction element with an interface enabling the user to perform an action.

The `AvButton` is an elegant, reusable Vue component designed to simplify the creation of custom buttons. It features adjustable sizes, an optional icon and a click manager, all in keeping with the `DSFR` style. It's easy to use, with the flexibility to adapt to different contexts.

For `AVENIR(s) ESR`, the button has been simplified to allow only two variants (`DEFAULT` without border and `OUTLINED` with border) and two themes (`PRIMARY` blue and `SECONDARY` grey).

🏅 Documentation on the `DsfrButton` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrButton)

## 📐 Structure

Buttons consist of :

- A label - mandatory, using the `label` prop, enables label display when `iconOnly` is `false`, also enables connection to `title` and `aria-label` ;
- An icon, which can be modified (see available icons) - optional.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'DEFAULT' \| 'OUTLINED'` | `'DEFAULT'` | | Button variant: without border (`DEFAULT`) or with border (`OUTLINED`). |
| `theme` | `'PRIMARY' \| 'SECONDARY'` | `'PRIMARY'` | | Button theme: blue (`PRIMARY`) or grey (`SECONDARY`). |
| `isLoading` | `boolean` | `false` | | Indicates a loading status for the button. |
| `iconScale` | `number` | `undefined` | | Allows you to manually change the icon size (it is automatically calculated otherwise). |
| `noRadius` | `boolean` | `false` | | Allows you to remove radii from the button border. |
| `disabled` | `boolean` | `false` | | Indicates the disabled state of the button. |
| `label` | `string` | | ✅ | Text label for the button. |
| `iconRight` | `boolean` | `false` | | Indicates the position of the icon in relation to the button text: left (`false`) or right (`true`). |
| `iconOnly` | `boolean` | `false` | | Hide label text (`true`) or show it (`false`). |
| `size` | `'sm' \| 'small' \| 'lg' \| 'large' \| 'md' \| 'medium' \| '' \| undefined` | `'md'` | | Button size. |
| `icon` | `string \| InstanceType<typeof VIcon>['$props']` | `undefined` | | Icon to be displayed in button. Can be a name or icon configuration. |
| `onClick` | `($event: MouseEvent) => void` | `undefined` | | Function called when button is clicked.

## 📡 Events

None.

## 🧩 Slots

None.

## 📝 Examples of use

```vue
<template>
  <AvButton
    label="See all"
    :on-click="navigateToStudentDeliverables"
    icon="mdi:arrow-right-thin"
  />
</template>
```

```vue
<template>
  <AvButton
    class="settings-btn"
    icon="mdi:dots-vertical"
    icon-only
    variant="OUTLINED"
    size="sm"
    label="Paramètres de la trace"
    :on-click="toggleSettingsMenu"
  />
</template>
```

```vue
<template>
  <AvButton
    label="Logout"
    icon="mdi:logout"
    variant="DEFAULT"
    theme="SECONDARY"
    size="sm"
    no-radius
  />
</template>
```
