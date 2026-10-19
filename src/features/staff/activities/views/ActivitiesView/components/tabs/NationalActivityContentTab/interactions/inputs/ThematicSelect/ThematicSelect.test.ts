import type { VueWrapper } from '@vue/test-utils'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { EActivityThematic } from '@/api/avenir-esr'
import ThematicSelect from '@/features/staff/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/inputs/ThematicSelect/ThematicSelect.vue'

BddTest().given('a thematic select component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ThematicSelect>>

  const stubs = {
    AvSelect: AvSelectStub,
  }

  const getSelect = () => wrapper.findComponent({ name: 'AvSelect' })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()

      wrapper = mount(ThematicSelect, {
        props: {
          modelValue: {
            itemId: EActivityThematic.TRANSVERSAL,
          },
        },
        global: {
          stubs,
        },
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the AvSelect component', () => {
      expect(getSelect().exists()).toBe(true)
    })

    BddTest().then('it should display the correct label', () => {
      expect(getSelect().props('label')).toBe('Thématique')
    })

    BddTest().then('it should display the correct placeholder', () => {
      expect(getSelect().props('placeholder')).toBe('Choisir une thématique')
    })

    BddTest().then('it should display the correct prefix icon', () => {
      expect(getSelect().props('prefixIcon')).toBe(MDI_ICONS.BOOK_OPEN_VARIANT)
    })

    BddTest().then('it should have one option per value in EActivityThematic', () => {
      expect(getSelect().props('options')).toHaveLength(
        Object.keys(EActivityThematic).length,
      )
    })

    BddTest().then('it should expose options using value and label', () => {
      const options = getSelect().props('options') as Array<{
        value: EActivityThematic
        label: string
      }>

      expect(options[0]).toEqual(expect.objectContaining({
        value: expect.any(String),
        label: expect.any(String),
      }))
      expect(options[0]).not.toHaveProperty('id')
    })

    BddTest().then('it should have the transverse option', () => {
      const options = getSelect().props('options') as Array<{
        value: EActivityThematic
        label: string
      }>

      const transverseOption = options.find(
        option => option.value === EActivityThematic.TRANSVERSAL,
      )

      expect(transverseOption).toEqual({
        value: EActivityThematic.TRANSVERSAL,
        label: 'Transverse',
      })
    })

    BddTest().then('it should select the thematic matching the model value', () => {
      expect(getSelect().props('modelValue')).toEqual({
        value: EActivityThematic.TRANSVERSAL,
        label: 'Transverse',
      })
    })

    BddTest().and('a different thematic is selected', () => {
      let selectedThematic: EActivityThematic | undefined

      beforeEach(async () => {
        const option = (getSelect().props('options') as Array<{
          value: EActivityThematic
          label: string
        }>).find(option => option.value === EActivityThematic.SELF_KNOWLEDGE)!

        await getSelect().vm.$emit('update:modelValue', option)
        await wrapper.vm.$nextTick()

        selectedThematic = wrapper.emitted('update:modelValue')?.at(-1)?.[0]
          ? (wrapper.emitted('update:modelValue')?.at(-1)?.[0] as { itemId: EActivityThematic }).itemId
          : undefined
      })

      BddTest().then('it should emit the selected thematic using the component model', () => {
        expect(selectedThematic).toBe(EActivityThematic.SELF_KNOWLEDGE)
      })
    })
  })
})
