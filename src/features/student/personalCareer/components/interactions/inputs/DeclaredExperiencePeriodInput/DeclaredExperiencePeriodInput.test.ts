import DeclaredExperiencePeriodInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperiencePeriodInput/DeclaredExperiencePeriodInput.vue'
import { AvPeriodInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const original = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...original,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile
    })
  }
})

BddTest().given('a declared experience period input component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperiencePeriodInput>>

  const stubs = {
    AvPeriodInput: AvPeriodInputStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockIsMobile.value = false
      wrapper = mount(DeclaredExperiencePeriodInput, {
        global: { stubs }
      })
    })

    BddTest().then('it should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the AvPeriodInput component', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.exists()).toBe(true)
    })

    BddTest().then('it should have type set to month', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('type')).toBe('month')
    })

    BddTest().then('it should display the correct labels', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('label')).toBe('Période')
      expect(input.props('startLabel')).toBe('Date de début')
      expect(input.props('endLabel')).toBe('Date de fin')
    })

    BddTest().then('it should have separator spacing', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('separatorSpacing')).toBe('var(--spacing-sm)')
    })

    BddTest().then('it should not be stacked on desktop', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('stacked')).toBe(false)
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      mockIsMobile.value = true
      wrapper = mount(DeclaredExperiencePeriodInput, {
        global: { stubs }
      })
    })

    BddTest().then('it should be stacked', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('stacked')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with custom props', () => {
    beforeEach(() => {
      mockIsMobile.value = false
      wrapper = mount(DeclaredExperiencePeriodInput, {
        props: {
          startModelValue: '2024-01',
          endModelValue: '2024-12',
          endDateDisabled: true,
          labelVisible: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass props to AvPeriodInput', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('startModelValue')).toBe('2024-01')
      expect(input.props('endModelValue')).toBe('2024-12')
      expect(input.props('endDateDisabled')).toBe(true)
      expect(input.props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('the user enters dates', () => {
    const onUpdateStart = vi.fn()
    const onUpdateEnd = vi.fn()

    beforeEach(async () => {
      vi.clearAllMocks()
      mockIsMobile.value = false
      wrapper = mount(DeclaredExperiencePeriodInput, {
        attrs: {
          'onUpdate:startModelValue': onUpdateStart,
          'onUpdate:endModelValue': onUpdateEnd
        },
        global: { stubs }
      })

      const input = wrapper.findComponent({ name: 'AvPeriodInput' })

      await input.vm.$emit('update:startModelValue', '2024-05')
      await input.vm.$emit('update:endModelValue', '2024-06')
    })

    BddTest().then('it should propagate the update events', () => {
      expect(onUpdateStart).toHaveBeenCalledWith('2024-05')
      expect(onUpdateEnd).toHaveBeenCalledWith('2024-06')
    })
  })

  BddTest().when('the component is mounted with attributes', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredExperiencePeriodInput, {
        attrs: {
          'data-testid': 'custom-period-input'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass attrs to AvPeriodInput', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.attributes('data-testid')).toBe('custom-period-input')
    })
  })

  BddTest().when('the component is mounted with custom label class', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredExperiencePeriodInput, {
        props: {
          labelClass: 'custom-class'
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass label class to AvPeriodInput', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('labelClass')).toBe('custom-class')
    })
  })
})
