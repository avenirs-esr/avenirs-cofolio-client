import type { VueWrapper } from '@vue/test-utils'
import { mockedAdditionalSkillProgressDetails } from '@/__mocks__/fixtures/student/skills.fixtures'
import { studentHomeRoute, studentProjectSkillsRoute } from '@/features/student/routes'
import StudentUpdateAdditionalSkillView from '@/features/student/views/StudentUpdateAdditionalSkillView/StudentUpdateAdditionalSkillView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const navigateToStudentAdditionalSkill = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentAdditionalSkill,
    }),
  }
})

const AvTabsStub = {
  name: 'AvTabs',
  props: ['modelValue'],
  template: '<div class="av-tabs-stub"><slot /></div>'
}

const AvTabStub = {
  name: 'AvTab',
  props: ['title', 'icon'],
  template: '<div class="av-tab-stub"><slot /></div>'
}

const PageTitleStubWithBack = {
  name: 'PageTitle',
  template: '<div />',
  props: ['title', 'breadcrumbLinks', 'back']
}

const stubs = {
  PageTitle: PageTitleStubWithBack,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub
}

BddTest().given('a student update additional skill view component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentUpdateAdditionalSkillView>>

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mountComponent(StudentUpdateAdditionalSkillView, {
      props: {
        skillId: '123'
      },
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render PageTitle with correct props', () => {
      const pageTitle = wrapper.findComponent({ name: 'PageTitle' })

      expect(pageTitle.exists()).toBe(true)
      expect(pageTitle.props('title')).toBe('Modifier ma compétence déclarée')
      expect(pageTitle.props('back')).toBe(studentProjectSkillsRoute)

      const breadcrumbLinks = pageTitle.props('breadcrumbLinks')
      expect(breadcrumbLinks).toHaveLength(4)
      expect(breadcrumbLinks[0]).toEqual({
        text: 'Accueil',
        to: studentHomeRoute
      })
      expect(breadcrumbLinks[1]).toEqual({
        text: 'Construire mon projet de vie'
      })
      expect(breadcrumbLinks[2]).toEqual({
        text: 'Toutes mes compétences',
        to: studentProjectSkillsRoute
      })
      expect(breadcrumbLinks[3]).toEqual({
        text: 'Mes autres compétences et certifications déclarées'
      })
    })

    BddTest().then('it should render the skill title', () => {
      const title = wrapper.find('.update-additional-skill-view__title .n4')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Placeholder Skill Title')
    })

    BddTest().then('it should render AvTabs with two tabs', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)

      const tabComponents = wrapper.findAllComponents({ name: 'AvTab' })
      expect(tabComponents).toHaveLength(2)
    })

    BddTest().then('it should render UpdateAdditionalSkillForm with correct props', () => {
      const form = wrapper.findComponent({ name: 'UpdateAdditionalSkillForm' })
      expect(form.exists()).toBe(true)
      expect(form.props('additionalSkillProgressDetails')).toEqual(mockedAdditionalSkillProgressDetails)
      expect(typeof form.props('onSkillUpdated')).toBe('function')
    })
  })

  BddTest().when('the form triggers onSkillUpdated', () => {
    BddTest().then('it should navigate using useNavigation.navigateToStudentAdditionalSkill', async () => {
      const form = wrapper.findComponent({ name: 'UpdateAdditionalSkillForm' })
      await form.vm.$props.onSkillUpdated()
      expect(navigateToStudentAdditionalSkill).toHaveBeenCalledTimes(1)
    })
  })
})
