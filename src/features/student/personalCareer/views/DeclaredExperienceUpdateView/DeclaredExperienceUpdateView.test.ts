import type { VueWrapper } from '@vue/test-utils'
import { PageTitleStub } from '@/common/components/PageTitle/PageTitle.stub'
import { UpdateInProgressBadgeStub } from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import DeclaredExperienceUpdateView from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/DeclaredExperienceUpdateView.vue'
import { AvCancelConfirmButtonsStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockRouteId = ref<string>('exp123')
const navigateToStudentDeclaredExperience = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()

  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
    useRoute: () => ({
      params: {
        get id () {
          return mockRouteId.value
        }
      }
    }),
  }
})

vi.mock('@/common/composables/use-navigation/use-navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables/use-navigation/use-navigation')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentDeclaredExperience
    }),
  }
})

const stubs = {
  AvIconText: AvIconTextStub,
  AvCancelConfirmButtons: AvCancelConfirmButtonsStub,
  PageTitle: PageTitleStub,
  UpdateInProgressBadge: UpdateInProgressBadgeStub
}

BddTest().given('a declared experience update view', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceUpdateView>>

  const mountComponentWithDefaults = async () => {
    wrapper = mountComponent(DeclaredExperienceUpdateView, {
      global: { stubs }
    })
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      await mountComponentWithDefaults()
    })

    BddTest().then('it should render PageTitle with correct title and breadcrumbs', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })
      expect(pageTitle.exists()).toBe(true)

      expect(pageTitle.props('title')).toBe('')
      expect(pageTitle.text()).toContain('Modifier')

      const breadcrumbs = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbs).toHaveLength(4)
    })

    BddTest().then('it should render UpdateInProgressBadge with correct props', () => {
      const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('show')).toBe(false)
    })

    BddTest().then('it should render the title of the currect tab', () => {
      const avIconText = wrapper.findComponent(AvIconTextStub)
      expect(avIconText.exists()).toBe(true)
      expect(avIconText.props('text')).toBe('Mon expérience déclarée')
    })

    BddTest().and('the cancel button is clicked', () => {
      beforeEach(async () => {
        const cancelButton = wrapper.findComponent(AvCancelConfirmButtonsStub).find('.cancel')
        await cancelButton.trigger('click')
      })

      BddTest().then('it should navigate to the declared experience detail view', () => {
        expect(navigateToStudentDeclaredExperience).toHaveBeenCalled()
      })
    })
  })
})
