import TracesTypeSelect from '@/features/traces/components/interactions/pickers/TracesTypeSelect/TracesTypeSelect.vue'
import { TraceAssociationTypes } from '@/features/traces/types/trace-association.types'
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
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the AvSelect component', () => {
      const select = wrapper.findComponent(AvSelectStub)
      expect(select.exists()).toBe(true)
    })

    BddTest().then('it should display the correct French label', () => {
      const select = wrapper.findComponent(AvSelectStub)
      expect(select.props('label')).toBe('Rechercher dans :')
    })

    BddTest().then('it should display the correct placeholder', () => {
      const select = wrapper.findComponent(AvSelectStub)
      expect(select.props('placeholder')).toBe('Sélectionnez un type de trace')
    })

    BddTest().then('it should have three options', () => {
      const select = wrapper.findComponent(AvSelectStub)
      expect(select.props('options')).toHaveLength(3)
    })

    BddTest().then('it should have the ALL option', () => {
      const select = wrapper.findComponent(AvSelectStub)
      const options = select.props('options')
      const allOption = options.find((opt: { id: TraceAssociationTypes }) => opt.id === TraceAssociationTypes.ALL)

      expect(allOption).toBeDefined()
      expect(allOption.label).toBe('Toutes mes traces')
      expect(allOption.id).toBe(TraceAssociationTypes.ALL)
    })

    BddTest().then('it should have the ASSOCIATED option', () => {
      const select = wrapper.findComponent(AvSelectStub)
      const options = select.props('options')
      const associatedOption = options.find((opt: { id: TraceAssociationTypes }) => opt.id === TraceAssociationTypes.ASSOCIATED)

      expect(associatedOption).toBeDefined()
      expect(associatedOption.label).toBe('Mes traces associées')
      expect(associatedOption.id).toBe(TraceAssociationTypes.ASSOCIATED)
    })

    BddTest().then('it should have the UNASSOCIATED option', () => {
      const select = wrapper.findComponent(AvSelectStub)
      const options = select.props('options')
      const unassociatedOption = options.find((opt: { id: TraceAssociationTypes }) => opt.id === TraceAssociationTypes.UNASSOCIATED)

      expect(unassociatedOption).toBeDefined()
      expect(unassociatedOption.label).toBe('Mes traces non associées')
      expect(unassociatedOption.id).toBe(TraceAssociationTypes.UNASSOCIATED)
    })
  })

  BddTest().when('the component is mounted with custom label', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          label: 'Custom Label'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the custom label', () => {
      const select = wrapper.findComponent(AvSelectStub)
      expect(select.props('label')).toBe('Custom Label')
    })
  })

  BddTest().when('the component is mounted with error message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          errorMessage: 'Ce champ est requis'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass the error message to AvSelect', () => {
      const select = wrapper.findComponent(AvSelectStub)
      expect(select.props('errorMessage')).toBe('Ce champ est requis')
    })
  })

  BddTest().when('the component is mounted with initial value', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          modelValue: { itemId: TraceAssociationTypes.UNASSOCIATED }
        },
        global: { stubs }
      })
    })

    BddTest().then('it should display the initial value', () => {
      const select = wrapper.findComponent(AvSelectStub)
      expect(select.props('selectedItem')).toEqual({ itemId: TraceAssociationTypes.UNASSOCIATED })
    })
  })

  BddTest().when('the user selects a trace type', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        global: { stubs }
      })

      const select = wrapper.findComponent(AvSelectStub)
      await select.vm.$emit('update:selectedItem', { itemId: TraceAssociationTypes.ASSOCIATED })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit the updated selected item', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([
        [{ itemId: TraceAssociationTypes.ASSOCIATED }]
      ])
    })
  })

  BddTest().when('the component receives additional props via restProps', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          disabled: true,
          required: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass additional props to AvSelect', () => {
      const select = wrapper.findComponent(AvSelectStub)
      expect(select.props('disabled')).toBe(true)
      expect(select.props('required')).toBe(true)
    })
  })

  BddTest().when('the user clears the selection', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(TracesTypeSelect, {
        props: {
          modelValue: { itemId: TraceAssociationTypes.ALL }
        },
        global: { stubs }
      })

      const select = wrapper.findComponent(AvSelectStub)
      await select.vm.$emit('update:selectedItem', undefined)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit undefined selected item', () => {
      expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
    })
  })
})
