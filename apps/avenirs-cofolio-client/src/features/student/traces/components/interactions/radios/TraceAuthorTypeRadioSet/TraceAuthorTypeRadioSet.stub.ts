export const TraceAuthorTypeRadioSetStub = {
  name: 'TraceAuthorTypeRadioSet',
  props: ['modelValue', 'errorMessage', 'name'],
  emits: ['update:modelValue', 'blur'],
  template: '<div data-testid="trace-author-type-radio-set-stub"><slot /></div>'
}
