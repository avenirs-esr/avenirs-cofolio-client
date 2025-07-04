# Modals - `AvModal`

## 🌟 Introduction

The `AvModal` component is an implementation of `DsfrModal`. The modal allows the user attention to be focused exclusively on a task or piece of information, without losing the context of the current page. This component requires a user action in order to be opened or closed.

The `AvModal` component is a configurable modal window, offering advanced features such as focus trapping, escape key listening for closure, and action button management. This component is designed to display dialogs and alerts in an accessible and ergonomic way.

🏅 Documentation on the `DsfrModal` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrModal)

## 📐 Structure

The default modal is used to highlight information that does not require user action. It is displayed when a button is clicked.

It consists of the following elements:
- The title (slot `header`), optional
- Content zone (slot `default`), mandatory
- The right-justified footer zone, which can be filled in using the `footer` slot, with the close button always to the left of the slot elements. This zone must contain buttons only.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `modalId` | `string` | `useRandomId('modal', 'dialog')` | `useRandomId('modal', 'dialog')` | Unique identifier for the modal. |
| `opened` | `boolean` | `false` | | Indicates whether the modal is open. |
| `isAlert` | `boolean` | `false` | | Specifies whether the modal is an alert (role `"alertdialog"` if `true`) or not (role will then be `"dialog"`). |
| `origin` | `{ focus: () => void }` | `{ focus() {} }` | | Reference to the origin element to restore focus after closure. |
| `icon` | `string` | `undefined` | | Name of icon to be displayed in modal title. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `md` | | Size of modal. |
| `closeButtonLabel` | `string` | `Fermer` | | Label and title (for accessibility) of close button. |
| `closeButtonVariant` | `'DEFAULT' \| 'OUTLINED' \| undefined` | `'DEFAULT'` | | Variant of close button: without border (`DEFAULT`) or with border (`OUTLINED`). |

## 📡 Events

| Name | Data (*payload*) | Description |
| --- | --- | --- |
| `‘close’` | `number` | Event emitted when modal is closed. |

## 🧩 Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for modal content. |
| `header` | Slot for modal header. |
| `footer` | Slot for modal footer. |

## 📝 Examples of use

```vue
<script lang="ts" setup>
const { showModal, displayModal, hideModal } = useModal()
</script>

<template>
  <AvButton
    label="Open modal"
    :on-click="displayModal"
  />
  <AvModal
    :opened="showModal"
    close-button-label="Close"
    size="lg"
    @close="hideModal"
  >
    <template #header>
      <span class="n5">An awesome title</span>
    </template>
    <span class="b2-regular">An awesome content</span>
    <template #footer>
      <AvButton label="A button to the right of the ‘Close’ button" />
    </template>
  </AvModal>
</template>
```
