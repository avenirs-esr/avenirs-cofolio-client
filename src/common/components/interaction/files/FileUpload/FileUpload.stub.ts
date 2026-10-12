export const FileUploadStub = defineComponent({
  name: 'FileUpload',
  props: [
    'modelValue',
    'accept',
    'maxFileSizeMb',
    'maxFiles',
    'maxWidth',
    'title',
    'description',
    'ariaLabel',
    'disabled',
    'disabledTooltip',
    'error',
    'validMessage',
    'fileName',
    'enableMultiple',
    'compact',
    'confirmDelete',
  ],
  emits: ['update:modelValue', 'change', 'blur'],
  template: `
    <div data-testid="file-upload-stub">
      <slot :active="false" />
    </div>
  `
})
