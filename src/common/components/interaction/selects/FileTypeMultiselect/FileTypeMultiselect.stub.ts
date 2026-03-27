export const FileTypeMultiselectStub = defineComponent({
  name: 'FileTypeMultiselect',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  template: `
    <div data-testid="file-type-multiselect">
      <label>Type de fichier</label>
      <select
        multiple
        :value="modelValue.map(o => o.value)"
        @change="onChange"
      >
        <option value="PDF">PDF</option>
        <option value="TEXT">Texte</option>
        <option value="SHEET">Tableur</option>
        <option value="IMAGE">Image</option>
        <option value="VIDEO">Vidéo</option>
        <option value="AUDIO">Audio</option>
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
