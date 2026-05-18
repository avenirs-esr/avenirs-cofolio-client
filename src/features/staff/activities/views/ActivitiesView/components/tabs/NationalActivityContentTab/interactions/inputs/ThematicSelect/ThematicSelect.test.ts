import { EActivityThematic } from '@/api/avenir-esr'
import ThematicSelect from '@/features/staff/activities/views/ActivitiesView/components/tabs/NationalActivityContentTab/interactions/inputs/ThematicSelect/ThematicSelect.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvSelectStub, BddTest, } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a thematic select component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ThematicSelect>>
  const stubs = { AvSelect: AvSelectStub,
  }

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
      const select = wrapper.findComponent({
        name: 'AvSelect',
      })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should display the correct label', () => {
      const select = wrapper.findComponent({
        name: 'AvSelect',
      })
      expect(select.props('label')).toBe(
        'Thématique',
      )
    })

    BddTest().then('it should display the correct placeholder', () => {
      const select = wrapper.findComponent({
        name: 'AvSelect',
      })
      expect(select.props('placeholder')).toBe(
        'Choisir une thématique',
      )
    })

    BddTest().then('it should display the correct prefix icon', () => {
      const select = wrapper.findComponent({
        name: 'AvSelect',
      })
      expect(select.props('prefixIcon')).toBe(
        MDI_ICONS.BOOK_OPEN_VARIANT,
      )
    })

    BddTest().then('it should have seven options', () => {
      const select = wrapper.findComponent({
        name: 'AvSelect',
      })
      expect(select.props('options')).toHaveLength(7)
    })

    BddTest().then('it should have transverse option', () => {
      const select = wrapper.findComponent({
        name: 'AvSelect',
      })

      const options = select.props('options') as Array<{
        id: EActivityThematic
        label: string
      }>

      const transverseOption = options.find(
        opt => opt.id === EActivityThematic.TRANSVERSAL,
      )
      expect(transverseOption).toBeDefined()
      expect(transverseOption?.label).toBe(
        'Transverse',
      )
    })
  })
})
