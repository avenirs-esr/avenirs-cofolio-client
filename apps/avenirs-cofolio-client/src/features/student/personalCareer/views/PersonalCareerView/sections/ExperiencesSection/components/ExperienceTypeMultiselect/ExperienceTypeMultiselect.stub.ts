export const ExperienceTypeMultiselectStub = defineComponent({
  name: 'ExperienceTypeMultiselect',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  template: `
    <div data-testid="experience-type-multiselect">
      <label>Type d'expérience</label>
      <select
        multiple
        :value="modelValue.map(o => o.value)"
        @change="onChange"
      >
        <option value="PROFESSIONAL">Expérience professionnelle</option>
        <option value="PERSONAL">Expérience personnelle</option>
        <option value="VOLUNTEER">Engagement et/ou bénévolat</option>
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
