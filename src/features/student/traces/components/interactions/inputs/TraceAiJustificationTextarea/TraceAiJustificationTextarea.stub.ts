export const TraceAiJustificationTextareaStub = defineComponent({
  name: 'TraceAiJustificationTextarea',
  props: ['id', 'modelValue', 'errorMessage', 'required', 'labelVisible', 'disabled'],
  emits: ['blur', 'update:modelValue'],
  template: '<div><textarea :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')"></textarea><span v-if="errorMessage" class="error">{{ errorMessage }}</span></div>'
})
