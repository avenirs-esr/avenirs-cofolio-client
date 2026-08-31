export const DeclaredExperienceSelectorStub = defineComponent({
  name: 'DeclaredExperienceSelector',
  props: ['declaredExperiences', 'modelValue'],
  emits: ['update:modelValue'],
  template: `<div class="declared-experience-selector-stub"></div>`
})
