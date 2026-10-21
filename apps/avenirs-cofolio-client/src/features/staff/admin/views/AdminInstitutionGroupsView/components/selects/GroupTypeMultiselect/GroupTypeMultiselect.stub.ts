export const GroupTypeMultiselectStub = defineComponent({
  name: 'GroupTypeMultiselect',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  template: `
    <div data-testid="group-type-multiselect">
      <label>Type de groupe</label>
      <select
        multiple
        :value="modelValue.map(o => o.value)"
        @change="onChange"
      >
        <option value="PROGRAM">Formation</option>
        <option value="PROGRAM_OPTION">Option de formation</option>
        <option value="STUDENT_GROUP">Ensemble d'apprenant(e)s</option>
      </select>
      <p class="av-multiselect__caption">
        {{ modelValue.length
          ? (modelValue.length + ' sélection(s)')
          : 'Sélectionner un ou plusieurs types'
        }}
      </p>
    </div>
  `,
  methods: {
    onChange (event: Event) {
      const selected = Array.from((event.target as HTMLSelectElement).selectedOptions).map(o => ({
        label: o.text,
        value: o.value
      }))
      this.$emit('update:modelValue', selected)
    }
  }
})
