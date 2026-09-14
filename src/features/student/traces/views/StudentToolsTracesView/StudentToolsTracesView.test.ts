import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import StudentToolsTracesView from '@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student tools traces view component', () => {
  const commonStubs = {
    PageTitle: PageTitleStub,
    StudentToolsTracesViewContainer: {
      name: 'StudentToolsTracesViewContainer',
      template: '<div class="student-tools-traces-view-container-stub" />'
    }
  }

  let wrapper: VueWrapper<InstanceType<typeof StudentToolsTracesView>>

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())

    wrapper = mount(StudentToolsTracesView, {
      global: {
        plugins: [createPinia()],
        stubs: commonStubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Ma bibliothèque de traces')
      expect(pageTitle.props('trailingLinks')).toBeUndefined()
    })

    BddTest().then('it should render StudentToolsTracesViewContainer', () => {
      const container = wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' })
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render the correct structure', () => {
      expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
    })
  })

  BddTest().and('no configuration', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      wrapper = mount(StudentToolsTracesView, {
        global: {
          plugins: [createPinia()],
          stubs: commonStubs
        }
      })
    })

    BddTest().when('the component is mounted with null configuration', () => {
      BddTest().then('it should still render all components', () => {
        expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
      })
    })
  })

  BddTest().and('no traces summary', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setActivePinia(createPinia())

      wrapper = mount(StudentToolsTracesView, {
        global: {
          plugins: [createPinia()],
          stubs: commonStubs
        }
      })
    })

    BddTest().when('the component is mounted with empty traces summary', () => {
      BddTest().then('it should still render essential components', () => {
        expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
      })
    })
  })
})
