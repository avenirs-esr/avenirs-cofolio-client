# Popovers - `AvPopover`

## 🌟 Introduction

The popover is a contextual container that is displayed as an overlay near its trigger element. This component can be used to display additional content or interactions, without leaving the current page or completely obscuring its context.

The `AvPopover` component is designed to offer accessible, ergonomic content, by trapping the focus inside the popover when it's open, and managing closure via the Escape key. It offers great flexibility via dedicated trigger (`trigger`) and content (`popover`) slots, allowing any content or interaction to be inserted.

It uses a dynamic positioning system to display itself in the right place in relation to its trigger, while guaranteeing good keyboard control and a good user experience.

## 📐 Structure

The popover consists of the following elements:
- The trigger (slot `trigger`), mandatory: Interactive element (for example, a button) that opens or closes the popover.
- The content (slot `popover`), mandatory: Content area that can contain text, buttons, lists or any other interactive element. This zone is displayed close to the trigger and captures the focus when opened.

The popover integrates :
- Focus trap for keyboard accessibility.
- Close by pressing the Escape key or clicking outside the popover.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `width` | `string` | `'12.5rem'` | | Width of popover. |
| `padding` | `string` | `'var(--spacing-md)'` | | Internal padding of popover. |

## 📡 Events

None.

## 🧩 Slots

| Name | Description |
| --- | --- |
| `trigger` | Slot for popover trigger. Provides `toggle` prop (function to open/close popover). |
| `popover` | Slot for popover content. Provides `close` prop (function to close popover). |

## 📝 Examples of use

```vue
<template>
  <AvPopover
    width="30rem"
    padding="var(--spacing-md)"
  >
    <template #trigger="{ toggle }">
      <AvButton
        label="Open popover"
        :on-click="toggle"
      />
    </template>
    <template #popover="{ close }">
      <div class="container">
        <span>Some content...</span>
        <AvButton
          label="Close"
          :on-click="close"
          size="sm"
        />
      </div>
    </template>
  </AvPopover>
</template>
```
