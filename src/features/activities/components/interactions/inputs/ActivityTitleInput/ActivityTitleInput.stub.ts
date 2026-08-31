export const ActivityTitleInputStub = defineComponent({
  name: 'ActivityTitleInput',
  props: {
    modelValue: { type: String },
    errorMessage: { type: String },
  },
  emits: ['update:modelValue', 'blur'],
  template: '<div data-testid="activity-title-input-stub"></div>',
})
