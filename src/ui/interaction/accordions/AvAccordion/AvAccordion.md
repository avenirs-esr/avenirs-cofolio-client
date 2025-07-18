# Accordions - `AvAccordions`

## 🌟 Introduction

The `AvAccordion` is a declarative component used exclusively in the `default` slot of `AvAccordionsGroup`.
`AvAccordion` allows you to configure an accordion by passing its props (such as `title` and `icon`) to the `AvAccordionsGroup` component without rendering.

It acts as a proxy component: it exposes information (props) used by `AvAccordionsGroup` to generate the interface.

🚫 This component does not display anything by itself and should not be used outside `AvAccordion`.

## 📐 Structure

None.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | | ✅ | Title of accordion displayed. |
| `icon` | `string` | `undefined` | | Accordion icon. |

## 📡 Events

None.

## 🧩 Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for accordion content. |

## 📝 Examples of use

```vue
<template>
  <AvAccordionsGroup>
    <AvAccordion
      title="Accordion 1"
      icon="mdi:file-document-multiple-outline"
    >
      <span>First accordion content</span>
    </AvAccordion>
    <AvAccordion
      title="Accordion 2"
      icon="mdi:plus-circle-outline"
    >
      <span>Second accordion content</span>
    </AvAccordion>
  </AvAccordionsGroup>
</template>
```
