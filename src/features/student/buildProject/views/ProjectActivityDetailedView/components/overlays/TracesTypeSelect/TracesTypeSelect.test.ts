import { EDeclaredActivityAssociationType } from '@/api/avenir-esr'
import TracesTypeSelect from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/TracesTypeSelect/TracesTypeSelect.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a traces type select component', () => {
  let wrapper: VueWrapper<InstanceType<typeof TracesTypeSelect>>

  const stubs = {
    AvSelect: AvSelectStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          modelValue: undefined
        },
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the AvSelect component', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should display the correct French label', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('label')).toBe('Rechercher dans :')
    })

    BddTest().then('it should display the correct placeholder', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('placeholder')).toBe('Sélectionnez un type de trace')
    })

    BddTest().then('it should have one option', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('options')).toHaveLength(1)
    })

    BddTest().then('it should have trace option', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      const options = select.props('options')
      const traceOption = options.find((opt: { id: EDeclaredActivityAssociationType }) => opt.id === EDeclaredActivityAssociationType.TRACE)

      expect(traceOption).toBeDefined()
      expect(traceOption.label).toBe('Mes traces non associées')
      expect(traceOption.id).toBe(EDeclaredActivityAssociationType.TRACE)
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          label: 'Custom Label',
          modelValue: undefined
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom label', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          errorMessage: 'Ce champ est requis',
          modelValue: undefined
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the error message to AvSelect', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the user selects trace type', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          modelValue: undefined
        },
        global: { stubs }
      })

      const select = wrapper.findComponent({ name: 'AvSelect' })
      await select.vm.$emit('update:selectedItem', { itemId: EDeclaredActivityAssociationType.TRACE })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update the model value', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('selectedItem')).toEqual({ itemId: EDeclaredActivityAssociationType.TRACE })
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          modelValue: { itemId: EDeclaredActivityAssociationType.TRACE }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('selectedItem')).toEqual({ itemId: EDeclaredActivityAssociationType.TRACE })
    })
  })

  BddTest().when('the component receives additional props via restProps', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          disabled: true,
          required: true,
          modelValue: undefined
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass additional props to AvSelect', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('disabled')).toBe(true)
      expect(select.props('required')).toBe(true)
    })
  })

  BddTest().when('the user clears the selection', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          modelValue: { itemId: EDeclaredActivityAssociationType.TRACE }
        },
        global: { stubs }
      })

      const select = wrapper.findComponent({ name: 'AvSelect' })
      await select.vm.$emit('update:selectedItem', undefined)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should update to undefined value', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('selectedItem')).toBeUndefined()
    })
  })
})
