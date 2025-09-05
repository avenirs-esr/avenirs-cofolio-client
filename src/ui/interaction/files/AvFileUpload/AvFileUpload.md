# File uploader - `AvFileUpload`

## 🌟 Introduction

The `AvFileUpload` component is an adaptation of the `DsfrFileUpload` code. This component allows you to upload files by clicking on the file upload area or by dragging and dropping a file in the area.

🏅 Documentation on `DsfrFileUpload` can be found at [VueDSFR](https://vue-ds.fr/composants/DsfrFileUpload)

## 🛠️ Props

| Name                 | Type                 | Default                  | Mandatory | Description                                                                                                                                 |
|----------------------|----------------------|--------------------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `id`                 | `Function`           | `() => useRandomId(...)` |           | Unique identifier for the file download component. If not specified, a random ID is generated.                                              |
| `ariaLabel`          | `string`             | `''`                     |           | ARIA label for file download button.                                                                                                        |
| `accept`             | `string \| string[]` | `undefined`              |           | Accepted file types, specified as a string (like HTML `accept` attribute) or an array of strings (which will be transformed into a string). |
| `validMessage`       | `string`             | `''`                     |           | Message indicating that the downloaded file is valid.                                                                                       |
| `error`              | `string`             | `''`                     |           | Error message to be displayed in case of download problem.                                                                                  |
| `modelValue`         | `File \| null`       | `''`                     |           | Value linked to file upload input template.                                                                                                 |
| `maxWidth`           | `string`             | `'none'`                 |           | Max width of the component.                                                                                                                 |
| `fileName`           | `string`             | `'none'`                 |           | Name of actual file.                                                                                                                        |
| `title`              | `string`             | `''`                     |           | Title of the file upload section.                                                                                                           |
| `description`        | `string`             | `''`                     |           | Description of the file upload section.                                                                                                     |
| `deleteButtonLabel`  | `string`             | `''`                     |           | delete button label.                                                                                                                        |
| `onDeleteFile`       | `Function`           | `'none'`                 |           | Method executed on delete file button click.                                                                                                |
| `enableMultiple`     | `boolean`            | `'none'`                 |           | Whether the file upload input enable multiple file selection or not.                                                                        |

## 📡 Events

| Name                      | Data (*payload*)                             | Description                                                      |
|---------------------------|----------------------------------------------|------------------------------------------------------------------|
| `'update:modelValue'`     | The updated model value (`File`)             | Event emitted when the model value linked to the file is updated |
| `'update:validMessage'`   | The updated valide message (`string`)        | Event emitted when the validMessage is updated.                  |
| `'update:error'`          | The updated error message (`string`)         | Event emitted when the error is updated.                         |
| `'change'`                | The new list of selected files (`FileList`)  | Event emitted when the selected file is changed.                 |
| `'onDropAcceptTypeError'` |                                              | Event emitted when a file of wrong type is dropped.              |
| `'onDropAcceptTypeError'` |                                              | Event emitted when a file of wrong type is dropped.              |

## 🧩 Slots

| Name      | Description                                                       |
|-----------|-------------------------------------------------------------------|
| `hint`    | Slot for the hint description.                                    |
| `left`    | Slot for the left content.                                        |
| `default` | Default slot for global content between the left and right icons. |

## 📝 Examples of use

```vue
<template>
  <AvFileUpload
    :accept="['.jpg', '.png']"
    @change="handleFileChange"
  >
    <span class="b2-regular">Add a new</span>
    <span class="b2-bold">trace of type pdf file</span>
    <span class="caption-regular">or drag and drop here</span>

    <template #hint>
      Text: <span class="caption-bold">5Mo • </span>
      Images: <span class="caption-bold">5Mo • </span>
      Audio: <span class="caption-bold">5Mo • </span>
      Vidéo: <span class="caption-bold">50Mo • </span>
      Application: <span class="caption-bold">10Mo</span>
    </template>
  </AvFileUpload>
</template>
```
