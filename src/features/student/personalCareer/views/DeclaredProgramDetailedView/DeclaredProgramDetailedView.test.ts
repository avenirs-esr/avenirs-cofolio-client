import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { ROUTES } from '@/common/constants'
import DeclaredProgramDetailedView from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/DeclaredProgramDetailedView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const DeclaredProgramDetailedStub = {
  name: 'DeclaredProgramDetailed',
  props: ['declaredProgramDetailed'],
  template: '<div class="declared-program-detailed-stub" />',
}

const stubs = {
  PageTitle: PageTitleStub,
  DeclaredProgramDetailed: DeclaredProgramDetailedStub,
}

BddTest().given('a declared program detailed view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramDetailedView>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(DeclaredProgramDetailedView, {
      props: {
        declaredProgramId: 'declared-program-123',
      },
      global: {
        stubs,
      },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('back')).toBe(ROUTES.STUDENT.PROJECT_SKILLS)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbLinks).toHaveLength(3)

      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: ROUTES.STUDENT.HOME,
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie',
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Mon parcours',
      })
    })

    BddTest().then('it should render PageTitle title containing the program title from query data', async () => {
      await vi.waitFor(() => {
        const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
        expect(pageTitle.exists()).toBe(true)
        expect(String(pageTitle.props('title'))).toContain('Master en Informatique')
      })
    })

    BddTest().then('it should render DeclaredProgramDetailed component with correct props', async () => {
      await vi.waitFor(() => {
        const detailsComponent = wrapper.findComponent({ name: 'DeclaredProgramDetailed' })
        expect(detailsComponent.exists()).toBe(true)
        expect(detailsComponent.props('declaredProgramDetailed')).toBeDefined()
        expect(detailsComponent.props('declaredProgramDetailed').title).toBe('Master en Informatique')
      })
    })
  })

  BddTest().when('declaredProgramDetailed is undefined', () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should not render DeclaredProgramDetailed', async () => {
      await vi.waitFor(() => {
        const detailsComponent = wrapper.findComponent({ name: 'DeclaredProgramDetailed' })
        expect(detailsComponent.exists()).toBe(false)
      })
    })

    BddTest().then('it should still render PageTitle', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)
    })
  })
})
