import { studentHomeRoute } from '@/features/student/routes'
import StudentToolsTracesView from '@/features/student/views/StudentToolsTracesView/StudentToolsTracesView.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const commonStubs = {
  PageTitle: {
    name: 'PageTitle',
    props: ['title', 'breadcrumbLinks'],
    template: '<div class="page-title-stub" />'
  },
  StudentToolsTracesViewContainer: {
    name: 'StudentToolsTracesViewContainer',
    template: '<div class="student-tools-traces-view-container-stub" />'
  }
}

describe('studentToolsTracesView', () => {
  describe('given a student tools traces view component', () => {
    let wrapper: VueWrapper

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

    describe('when the component is mounted', () => {
      it('then it should render PageTitle with correct props', () => {
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

        expect(pageTitle.exists()).toBe(true)
        expect(pageTitle.props('title')).toBe('Ma bibliothèque de traces')

        const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
        expect(breadcrumbLinks).toHaveLength(3)
        expect(breadcrumbLinks[0]).toEqual({
          text: 'Accueil',
          to: studentHomeRoute
        })
        expect(breadcrumbLinks[1]).toEqual({
          text: 'Mes outils'
        })
        expect(breadcrumbLinks[2]).toEqual({
          text: 'Mes traces'
        })
      })

      it('then it should render StudentToolsTracesViewContainer', () => {
        const container = wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' })
        expect(container.exists()).toBe(true)
      })

      it('then it should render the correct structure', () => {
        expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
      })
    })
  })

  describe('given a student tools traces view component with no configuration', () => {
    let wrapper: VueWrapper

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

    describe('when the component is mounted with null configuration', () => {
      it('then it should still render all components', () => {
        expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
      })
    })
  })

  describe('given a student tools traces view component with no traces summary', () => {
    let wrapper: VueWrapper

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

    describe('when the component is mounted with empty traces summary', () => {
      it('then it should still render essential components', () => {
        expect(wrapper.findComponent({ name: 'PageTitle' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentToolsTracesViewContainer' }).exists()).toBe(true)
      })
    })
  })
})
