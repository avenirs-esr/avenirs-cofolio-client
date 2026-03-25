import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import { SelectedAssociateTracesContainerStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/SelectedAssociateTracesContainer/SelectedAssociateTracesContainer.stub'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import { AvAutocompleteStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const isMobileMock = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: isMobileMock,
    })
  }
})

BddTest().given('a search association layout', () => {
  let wrapper: ReturnType<typeof mount<typeof SearchAssociationLayout>>

  const options: AvAutocompleteOption[] = [
    { label: 'Trace 1', value: 'trace-1' },
    { label: 'Trace 2', value: 'trace-2' }
  ]

  const traces = [
    { id: 'trace-1', title: 'Trace 1' },
    { id: 'trace-2', title: 'Trace 2' }
  ]

  const stubs = {
    AvAutocomplete: AvAutocompleteStub,
    SelectedAssociateTracesContainer: SelectedAssociateTracesContainerStub
  }

  beforeEach(() => {
    isMobileMock.value = false

    wrapper = mount(SearchAssociationLayout, {
      props: {
        modelValue: [],
        options,
        traces,
        inputOptions: {
          placeholder: 'Search traces'
        },
        getOptionKey: (option: AvAutocompleteOption) => option.value,
        getOptionLabel: (option: AvAutocompleteOption) => option.label
      },
      slots: {
        beforeSearch: '<div data-testid="before-search-slot-content">Before search content</div>'
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted on desktop', () => {
    BddTest().then('it should render the layout wrapper', () => {
      expect(wrapper.find('[data-testid="search-association-layout"]').exists()).toBe(true)
    })

    BddTest().then('it should render the beforeSearch slot', () => {
      expect(wrapper.find('[data-testid="before-search-slot-content"]').exists()).toBe(true)
    })

    BddTest().then('it should render the autocomplete', () => {
      const autocomplete = wrapper.findComponent(AvAutocompleteStub)

      expect(autocomplete.exists()).toBe(true)
      expect(autocomplete.props('modelValue')).toEqual([])
      expect(autocomplete.props('options')).toEqual(options)
      expect(autocomplete.props('multiSelect')).toBe(true)
      expect(autocomplete.props('showSelectedSection')).toBe(false)
      expect(autocomplete.props('displaySelectionInInput')).toBe(false)
      expect(autocomplete.props('inputOptions')).toEqual({
        placeholder: 'Search traces'
      })
    })

    BddTest().then('it should render the selected traces container', () => {
      const selectedContainer = wrapper.findComponent(SelectedAssociateTracesContainerStub)

      expect(selectedContainer.exists()).toBe(true)
      expect(selectedContainer.props('traces')).toEqual(traces)
    })

    BddTest().then('it should use desktop layout classes', () => {
      const layout = wrapper.find('[data-testid="search-association-layout"]')

      expect(layout.classes()).toContain('search-association-layout')
      expect(layout.classes()).toContain('av-row--md')
      expect(layout.classes()).toContain('av-align-stretch--md')
      expect(layout.classes()).toContain('av-col')
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(() => {
      isMobileMock.value = true

      wrapper = mount(SearchAssociationLayout, {
        props: {
          modelValue: [],
          options,
          traces,
          inputOptions: {
            placeholder: 'Search traces'
          }
        },
        slots: {
          beforeSearch: '<div data-testid="before-search-slot-content">Before search content</div>'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should use mobile layout classes', () => {
      const layout = wrapper.find('[data-testid="search-association-layout"]')

      expect(layout.classes()).toContain('search-association-layout')
      expect(layout.classes()).toContain('av-col')
      expect(layout.classes()).not.toContain('av-row')
      expect(layout.classes()).not.toContain('av-align-stretch')
    })

    BddTest().then('it should still render the beforeSearch slot', () => {
      expect(wrapper.find('[data-testid="before-search-slot-content"]').exists()).toBe(true)
    })

    BddTest().then('it should still render the autocomplete and selected container', () => {
      expect(wrapper.findComponent(AvAutocompleteStub).exists()).toBe(true)
      expect(wrapper.findComponent(SelectedAssociateTracesContainerStub).exists()).toBe(true)
    })
  })

  BddTest().when('the autocomplete emits update:modelValue', () => {
    const updatedSelection: AvAutocompleteOption[] = [
      { label: 'Trace 1', value: 'trace-1' }
    ]

    beforeEach(async () => {
      const autocomplete = wrapper.findComponent(AvAutocompleteStub)
      autocomplete.vm.$emit('update:modelValue', updatedSelection)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:modelValue', () => {
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([updatedSelection])
    })
  })

  BddTest().when('the autocomplete emits search', () => {
    beforeEach(async () => {
      const autocomplete = wrapper.findComponent(AvAutocompleteStub)
      autocomplete.vm.$emit('search', 'trace')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit search', () => {
      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')?.[0]).toEqual(['trace'])
    })
  })

  BddTest().when('the autocomplete emits clear', () => {
    beforeEach(async () => {
      const autocomplete = wrapper.findComponent(AvAutocompleteStub)
      autocomplete.vm.$emit('clear')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit clear', () => {
      expect(wrapper.emitted('clear')).toBeTruthy()
      expect(wrapper.emitted('clear')?.[0]).toEqual([])
    })
  })

  BddTest().when('the autocomplete emits loadMore', () => {
    beforeEach(async () => {
      const autocomplete = wrapper.findComponent(AvAutocompleteStub)
      autocomplete.vm.$emit('loadMore')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit loadMore', () => {
      expect(wrapper.emitted('loadMore')).toBeTruthy()
      expect(wrapper.emitted('loadMore')?.[0]).toEqual([])
    })
  })

  BddTest().when('the selected traces container emits delete', () => {
    beforeEach(async () => {
      const selectedContainer = wrapper.findComponent(SelectedAssociateTracesContainerStub)
      selectedContainer.vm.$emit('delete', 'trace-2')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit delete', () => {
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')?.[0]).toEqual(['trace-2'])
    })
  })

  BddTest().when('no beforeSearch slot is provided', () => {
    beforeEach(() => {
      wrapper = mount(SearchAssociationLayout, {
        props: {
          modelValue: [],
          options,
          traces
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should still render the layout', () => {
      expect(wrapper.find('[data-testid="search-association-layout"]').exists()).toBe(true)
    })

    BddTest().then('it should still render the autocomplete', () => {
      expect(wrapper.findComponent(AvAutocompleteStub).exists()).toBe(true)
    })

    BddTest().then('it should still render the selected traces container', () => {
      expect(wrapper.findComponent(SelectedAssociateTracesContainerStub).exists()).toBe(true)
    })
  })
})
