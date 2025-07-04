# Toasters - `AvToaster`

## 🌟 Introduction

The `AvToaster` component allows you to display alerts as notifications at the bottom of the page.

This standalone component must be placed at the top level of the application (e.g., in `App.vue`) and works independently of the messages given in props. Those messages should be passed thanks to a Pinia `toaster` store.

## 📐 Structure

The toaster is composed of a set of `AvAlert` (1 per message).

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `messages` | `Message[]` | | ✅ | List of messages to display in the toaster. Each message must follow the structure defined by the Message interface. :<br>• `id?: string`: Unique identifier for the message<br>• `title?: string`: Message title<br>• `description: string`: Detailed description of the message<br>• `type: 'info' \| 'success' \| 'warning' \| 'error'`: Type of message to display<br>• `closeable?: boolean`: Indicates whether the message can be manually closed by the user<br>• `titleTag?: 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'`: HTML tag used for the message title<br>• `timeout?: number`: Time to display the message in milliseconds before automatically closing (if not set, the message will remain displayed until manually closed or another action) |
| `onRemoveMessage` | `(id: string) => void` | | ✅ | Function called to remove a message from the toaster. |

## 📡 Events

None.

## 🧩 Slots

None.

## 📝 Examples of use

```vue
<template>
  <AvToaster />
</template>
```
