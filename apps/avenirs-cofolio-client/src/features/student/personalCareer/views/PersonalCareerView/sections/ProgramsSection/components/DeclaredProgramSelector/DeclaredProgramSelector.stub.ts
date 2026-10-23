export const DeclaredProgramSelectorStub = defineComponent({
  name: 'DeclaredProgramSelector',
  props: ['declaredPrograms', 'modelValue'],
  emits: ['update:modelValue'],
  template: `<div class="declared-program-selector-stub"></div>`
})
