export const TraceLinkInputStub = defineComponent({
  name: 'TraceLinkInput',
  props: ['id', 'modelValue', 'errorMessage', 'required'],
  emits: ['update:modelValue', 'blur'],
  template: '<div><input type="text" :id="id" :value="modelValue" :required="required" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" /><span v-if="errorMessage" class="error">{{ errorMessage }}</span></div>'
})
