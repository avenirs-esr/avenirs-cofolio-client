import DeclaredExperiencePeriodInput from '@/features/student/personalCareer/components/interactions/inputs/DeclaredExperiencePeriodInput/DeclaredExperiencePeriodInput.vue'
import { AvPeriodInputStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const original = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...original,
    useAvBreakpoints: () => ({
      isMobile: ref(false)
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

    BddTest().then('it should display the correct French label', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('label')).toBe('Période')
    })

    BddTest().then('it should display the correct French start label', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('startLabel')).toBe('Date de début')
    })

    BddTest().then('it should display the correct French end label', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
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

  BddTest().when('the component is mounted with custom props', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperiencePeriodInput, {
        props: {
          startModelValue: '2024-01',
          endModelValue: '2024-12',
          endDateDisabled: true
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass start model value to AvPeriodInput', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('startModelValue')).toBe('2024-01')
    })

    BddTest().then('it should pass end model value to AvPeriodInput', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('endModelValue')).toBe('2024-12')
    })

    BddTest().then('it should pass endDateDisabled to AvPeriodInput', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('endDateDisabled')).toBe(true)
    })
  })

  BddTest().when('the component is mounted with label visibility disabled', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperiencePeriodInput, {
        props: {
          labelVisible: false
        },
        global: { stubs }
      })
    })

    BddTest().then('it should pass labelVisible false to AvPeriodInput', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.props('labelVisible')).toBe(false)
    })
  })

  BddTest().when('the user enters a start date', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperiencePeriodInput, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      await input.vm.$emit('update:startModelValue', '2024-01')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:startModelValue event', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.emitted('update:startModelValue')).toBeTruthy()
      expect(input.emitted('update:startModelValue')?.[0]).toEqual(['2024-01'])
    })
  })

  BddTest().when('the user enters an end date', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      wrapper = mount(DeclaredExperiencePeriodInput, {
        global: { stubs }
      })
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      await input.vm.$emit('update:endModelValue', '2024-12')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:endModelValue event', () => {
      const input = wrapper.findComponent({ name: 'AvPeriodInput' })
      expect(input.emitted('update:endModelValue')).toBeTruthy()
      expect(input.emitted('update:endModelValue')?.[0]).toEqual(['2024-12'])
    })
  })

  BddTest().when('the component is mounted with attributes', () => {
    beforeEach(() => {
      vi.clearAllMocks()
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
      vi.clearAllMocks()
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
