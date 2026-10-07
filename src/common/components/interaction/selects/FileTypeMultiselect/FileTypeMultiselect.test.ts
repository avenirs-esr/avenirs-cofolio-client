import FileTypeMultiselect from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.vue'
import { TraceType } from '@/features/student/traces/types/traces.types'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const AvMultiselectStub = defineComponent({
  name: 'AvMultiselect',
  props: {
    modelValue: Array,
    options: Array,
    label: String,
    placeholder: String,
    selectedText: String,
    dense: Boolean
  },
  emits: ['update:modelValue'],
  template: `
    <div :class="{ 'av-multiselect--dense': dense }">
      <label>{{ label }}</label>
      <select
        multiple
        :value="modelValue.map(o => o.value)"
        @change="$emit(
          'update:modelValue',
          Array.from($event.target.selectedOptions).map(o => ({
            label: o.text,
            value: o.value
          }))
        )"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <p class="av-multiselect__caption">
        {{ modelValue.length
          ? (selectedText || modelValue.length + ' sélection(s)')
          : placeholder
        }}
      </p>
    </div>
  `
})

BddTest().given('a FileTypeMultiselect component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FileTypeMultiselect>>

  const stubs = { AvMultiselect: AvMultiselectStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(FileTypeMultiselect, { global: { stubs } })
    })

    BddTest().then('it should render the multiselect with the correct options', () => {
      const options = wrapper.findAll('option')
      expect(options).toHaveLength(7)
      expect(options[0].text()).toBe('Lien')
      expect(options[0].attributes('value')).toBe(TraceType.LINK)
      expect(options[1].text()).toBe('Fichier pdf')
      expect(options[2].text()).toBe('Fichier texte (word, odt)')
      expect(options[3].text()).toBe('Fichier tableur (excel, ods)')
      expect(options[4].text()).toBe('Fichier image (jpg, jpeg, png, svg)')
      expect(options[5].text()).toBe('Fichier vidéo (mp4, mov, avi)')
      expect(options[6].text()).toBe('Fichier audio (mp3, wav)')
    })

    BddTest().and('when the user selects some options', () => {
      beforeEach(async () => {
        const select = wrapper.find('select')
        await select.setValue([TraceType.LINK, 'PDF'])
      })

      BddTest().then('it should emit the correct modelValue', () => {
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        const emittedValue = wrapper.emitted('update:modelValue')![0][0]
        expect(emittedValue).toEqual([
          { label: 'Lien', value: TraceType.LINK },
          { label: 'Fichier pdf', value: 'PDF' }
        ])
      })
    })
  })
})
