# Inputs - `AvInput`

## 🌟 Introduction

The `AvInput` component is a flexible and accessible input component that provides a standardized way to collect user input in forms and interfaces. It extends the Vue DSFR foundation with additional functionality, supporting various input types, validation states, and accessibility features to ensure a consistent user experience.

Built on top of the `DsfrInput` component, it adds prefix icon support, enhanced validation messaging, and custom styling while maintaining full compatibility with the French government's design system standards.

## 📐 Structure

The input component consists of the following elements:
- **Wrapper**: Container that manages the overall layout and positioning
- **Prefix Icon** (optional): Visual icon positioned at the beginning of the input field
- **Input Field**: The main input element (can be rendered as input or textarea)
- **Label**: Descriptive text for the input field
- **Hint**: Optional helper text displayed below the label
- **Error Messages**: Validation error messages displayed when validation fails
- **Success Messages**: Validation success messages displayed when validation passes

The component integrates focus management, proper ARIA attributes, and responsive design patterns.

## 🛠️ Props

| Name | Type | Default | Mandatory | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `undefined` |  | ID of the input element |
| `descriptionId` | `string` | `undefined` |  | ID of the description element |
| `hint` | `string` | `undefined` |  | Hint text displayed below the label |
| `isValid` | `boolean` | `false` |  | Validation state - valid |
| `isTextarea` | `boolean` | `false` |  | Render as textarea instead of input |
| `labelVisible` | `boolean` | `true` |  | Whether the label is visible |
| `label` | `string` | `undefined` |  | Label text |
| `labelClass` | `string` | `undefined` |  | CSS class for the label |
| `modelValue` | `string \| number \| null` | `undefined` |  | Model value for v-model |
| `placeholder` | `string` | `undefined` |  | Placeholder text |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` |  | Input type |
| `disabled` | `boolean` | `false` |  | Whether the input is disabled |
| `required` | `boolean` | `false` |  | Whether the input is required |
| `maxlength` | `number` | `undefined` |  | Maximum length of input |
| `minlength` | `number` | `undefined` |  | Minimum length of input |
| `errorMessage` | `string \| string[]` | `undefined` |  | Error message(s) to display |
| `validMessage` | `string \| string[]` | `undefined` |  | Valid message(s) to display |
| `prefixIcon` | `string` | `undefined` |  | Prefix icon name (optional) |

## 📡 Events

| Name | Data (*payload*) | Description |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| null` | Emitted when the input value changes |

## 🧩 Slots

| Name | Description |
| --- | --- |
| `requiredTip` | Slot for custom required field indicator |

## 📝 Examples of use

### Basic Input

```vue
<AvInput
  label="Full Name"
  placeholder="Enter your full name"
  v-model="fullName"
/>
```

### Email Input with Icon

```vue
<AvInput
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  prefix-icon="mdi:email-outline"
  v-model="email"
  required
/>
```

### Password Input

```vue
<AvInput
  type="password"
  label="Password"
  placeholder="Enter your password"
  prefix-icon="mdi:lock-outline"
  v-model="password"
  :minlength="8"
  required
/>
```

### Textarea

```vue
<AvInput
  is-textarea
  label="Message"
  placeholder="Enter your message..."
  v-model="message"
  :maxlength="500"
/>
```

### With Validation

```vue
<AvInput
  label="Username"
  v-model="username"
  :error-message="usernameError"
  :valid-message="usernameValid"
  :minlength="3"
  required
/>
```

### Search Input

```vue
<AvInput
  type="search"
  label="Search"
  placeholder="Search for items..."
  prefix-icon="mdi:magnify"
  v-model="searchQuery"
/>
```

### Form with Multiple Inputs

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <AvInput
      v-model="form.email"
      label="Email"
      type="email"
      prefix-icon="mdi:email-outline"
      :error-message="errors.email"
      required
    />

    <AvInput
      v-model="form.password"
      label="Password"
      type="password"
      prefix-icon="mdi:lock-outline"
      :error-message="errors.password"
      :minlength="8"
      required
    />

    <AvInput
      v-model="form.bio"
      label="Bio"
      is-textarea
      hint="Tell us about yourself"
      :maxlength="500"
    />

    <button type="submit">Submit</button>
  </form>
</template>
```