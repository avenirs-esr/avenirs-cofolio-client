import type { AvMultiselectOptionGroup } from '@avenirs-esr/avenirs-dsav'
import { FileGlobalType } from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.types'
import FileTypeMultiselect from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.vue'
import { TraceType } from '@/features/student/traces/types/traces.types'
import { AvMultiselectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a FileTypeMultiselect component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FileTypeMultiselect>>

  const stubs = { AvMultiselect: AvMultiselectStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(FileTypeMultiselect, { global: { stubs } })
    })

    BddTest().then('it should render the multiselect with grouped options', () => {
      const groups = wrapper.findComponent(AvMultiselectStub).props('options') as AvMultiselectOptionGroup[]

      expect(groups).toHaveLength(2)
      expect(groups[0].label).toBe('Fichiers')
      expect(groups[0].children).toHaveLength(6)
      expect(groups[0].children[0]).toMatchObject({ label: 'Fichier pdf', value: FileGlobalType.PDF })
      expect(groups[1].label).toBe('Autres')
      expect(groups[1].children).toEqual([
        expect.objectContaining({ label: 'Lien', value: TraceType.LINK })
      ])
    })

    BddTest().and('when the user selects some options', () => {
      beforeEach(() => {
        const multiselect = wrapper.findComponent(AvMultiselectStub)
        const groups = multiselect.props('options') as AvMultiselectOptionGroup[]

        multiselect.vm.$emit('update:modelValue', [groups[0].children[0], groups[1].children[0]])
      })

      BddTest().then('it should pass the selected options to the multiselect modelValue', async () => {
        const multiselect = wrapper.findComponent(AvMultiselectStub)

        await vi.waitFor(() => {
          expect(multiselect.props('modelValue')).toEqual([
            expect.objectContaining({ label: 'Fichier pdf', value: FileGlobalType.PDF }),
            expect.objectContaining({ label: 'Lien', value: TraceType.LINK })
          ])
        })
      })
    })
  })
})
