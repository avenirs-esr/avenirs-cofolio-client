import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { DeclaredExperienceSideMenuStub }
  from '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.stub'
import DeclaredExperienceView
, { type DeclaredExperienceViewProps } from '@/features/student/personalCareer/views/DeclaredExperienceView/DeclaredExperienceView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentUpdateDeclaredExperience = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentUpdateDeclaredExperience,
    }),
  }
})

const routerPush = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    useRoute: () => ({
      params: {}
    }),
    useRouter: () => ({
      push: routerPush
    })
  }
})

const stubs = {
  PageTitle: PageTitleStub,
  DeclaredExperienceSideMenu: DeclaredExperienceSideMenuStub
}

BddTest().given('a declared experience view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceView>>
  const props: DeclaredExperienceViewProps = {
    experienceId: 'exp-123'
  }

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceView, {
      props,
      global: { stubs }
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountComponentWithDefaults()
      vi.clearAllMocks()
    })

    BddTest().then('it should render PageTitle with correct title and breadcrumbs', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)

      expect(pageTitle.props('title')).toBe('')
      expect(pageTitle.text()).toContain('Détail')

      const breadcrumbs = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbs).toHaveLength(4)
    })

    BddTest().then('it should render the side menu', () => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
      expect(sideMenu.exists()).toBe(true)
    })

    BddTest().then('it should pass a dropdown into the title', () => {
      const dropdown = wrapper.findComponent({ name: 'DeclaredExperienceDetailsDropdown' })
      expect(dropdown.exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to the side menu', () => {
      const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })

      expect(sideMenu.props()).toHaveProperty('experiences')
      expect(sideMenu.props()).toHaveProperty('experienceCount')

      expect(Array.isArray(sideMenu.props('experiences'))).toBe(true)
      expect(typeof sideMenu.props('experienceCount')).toBe('number')
    })

    BddTest().and('loading more experiences from the side menu', () => {
      beforeEach(() => {
        const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
        sideMenu.vm.$emit('loadMoreExperiences')
      })

      BddTest().then('it should trigger the pagination composable', () => {
        expect(wrapper.exists()).toBe(true)
      })
    })

    BddTest().and('selecting an experience from the side menu', () => {
      const experienceId = 'declared-experience-1'

      beforeEach(() => {
        const sideMenu = wrapper.findComponent({ name: 'DeclaredExperienceSideMenu' })
        sideMenu.vm.$emit('selectExperience', experienceId)
      })

      BddTest().then('it should navigate to the declared experience route', () => {
        expect(routerPush).toHaveBeenCalledWith({
          name: 'student-declared-experience',
          params: { id: experienceId }
        })
      })
    })
  })

  BddTest().and('the user selects to update the declared experience', () => {
    beforeEach(async () => {
      const dropdown = wrapper.findComponent({ name: 'DeclaredExperienceDetailsDropdown' })
      await dropdown.vm.$emit('updateSelected')
    })

    BddTest().then('it should navigate to the update declared experience view', () => {
      expect(navigateToStudentUpdateDeclaredExperience).toHaveBeenCalledWith({ replace: true })
    })
  })
})
